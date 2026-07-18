import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { AppStore } from "../core/app.store";
import {
  ArchitectureModel,
  Artifact,
  ArtifactWorkspace,
  AuditLog,
  CostEstimate,
  DiscoveryAnswer,
  DiscoveryQuestion,
  GenerationJob,
  Organization,
  Project,
  SecurityFinding,
  Role,
  User,
} from "../models/domain";

type ApiRole = Uppercase<Role> | Role;

interface ApiUser extends Omit<User, "role"> {
  role: ApiRole;
}

interface ApiAuthResponse {
  token: string;
  user: ApiUser;
}

interface AuthResponse {
  token: string;
  user: User;
}

const API_ROLE_BY_APP_ROLE: Record<Role, Uppercase<Role>> = {
  Admin: "ADMIN",
  Architect: "ARCHITECT",
  Security: "SECURITY",
  Viewer: "VIEWER",
};

const APP_ROLE_BY_API_ROLE: Record<string, Role> = {
  ADMIN: "Admin",
  ARCHITECT: "Architect",
  SECURITY: "Security",
  VIEWER: "Viewer",
};

function toApiRole(role: Role): Uppercase<Role> {
  return API_ROLE_BY_APP_ROLE[role];
}

function toAppRole(role: ApiRole): Role {
  return APP_ROLE_BY_API_ROLE[String(role).toUpperCase()] ?? "Viewer";
}



type ApiArtifact = Partial<Artifact> & { _id?: string; title?: string; body?: unknown; data?: unknown; artifact?: unknown };
type ArtifactListResponse = ApiArtifact[] | { artifacts?: ApiArtifact[]; data?: ApiArtifact[]; items?: ApiArtifact[]; results?: ApiArtifact[] };
type ArtifactWorkspaceResponse = Partial<ArtifactWorkspace> & { model?: ArchitectureModel | string | null; architectureModelId?: string; artifacts?: ApiArtifact[]; data?: ApiArtifact[]; items?: ApiArtifact[]; results?: ApiArtifact[] };

function artifactTitle(type: string): string {
  return type
    .split(/[_.-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Artifact";
}

function stringifyArtifactContent(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(stringifyArtifactContent).filter(Boolean).join("\n\n");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["markdown", "text", "summary", "content", "body"]) {
      if (typeof record[key] === "string" && record[key]) return record[key];
    }
    if (Array.isArray(record["slides"])) return stringifyArtifactContent(record["slides"]);
    if (Array.isArray(record["sections"])) return stringifyArtifactContent(record["sections"]);
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function toArtifact(artifact: ApiArtifact, projectId = ""): Artifact {
  const type = artifact.type || "artifact";
  const content = artifact.content || stringifyArtifactContent(artifact.markdown ?? artifact.text ?? artifact.summary ?? artifact.sections ?? artifact.slides ?? artifact.body ?? artifact.data ?? artifact.artifact);
  const language = artifact.language || (content.trim().startsWith("{") || content.trim().startsWith("[") ? "json" : "markdown");
  return {
    ...artifact,
    id: artifact.id ?? artifact._id ?? `${type}-workspace`,
    projectId: artifact.projectId ?? projectId,
    type,
    name: artifact.name ?? artifact.title ?? artifactTitle(type),
    status: artifact.status ?? "draft",
    language,
    version: artifact.version ?? "draft",
    content,
    updatedAt: artifact.updatedAt ?? "",
  };
}

function unwrapArtifacts(response: ArtifactListResponse): ApiArtifact[] {
  if (Array.isArray(response)) return response;
  return response.artifacts ?? response.data ?? response.items ?? response.results ?? [];
}

function toArtifactWorkspace(response: ArtifactWorkspaceResponse, projectId: string): ArtifactWorkspace {
  const artifacts = unwrapArtifacts(response as ArtifactListResponse).map((artifact) => toArtifact(artifact, projectId));
  return {
    architectureModel: response.architectureModel ?? response.model ?? response.architectureModelId ?? null,
    artifacts,
  };
}

type ApiProject = Partial<Project> & { _id?: string; organization?: string; client?: string };
type ProjectListResponse = ApiProject[] | { projects?: ApiProject[]; data?: ApiProject[]; items?: ApiProject[]; results?: ApiProject[] };
type ProjectResponse = ApiProject | { project?: ApiProject; data?: ApiProject; item?: ApiProject };

function unwrapProjects(response: ProjectListResponse): ApiProject[] {
  if (Array.isArray(response)) return response;
  return response.projects ?? response.data ?? response.items ?? response.results ?? [];
}

function unwrapProject(response: ProjectResponse): ApiProject {
  if ("project" in response || "data" in response || "item" in response) {
    return response.project ?? response.data ?? response.item ?? {};
  }
  return response as ApiProject;
}

function toProject(project: ApiProject): Project {
  const id = project.id ?? project._id ?? "";
  return {
    ...project,
    id,
    name: project.name || "Untitled project",
    company: project.company || project.client || project.organization || "Not specified",
    industry: project.industry || "Not specified",
    migrationType: project.migrationType || "Not specified",
    status: project.status || "DRAFT",
    cloudProvider: project.cloudProvider ?? null,
    completion: project.completion ?? 0,
    lastUpdated: project.lastUpdated ?? project.updatedAt ?? project.createdAt ?? "",
    generatedArtifacts: project.generatedArtifacts ?? 0,
    openRisks: project.openRisks ?? 0,
    securityScore: project.securityScore ?? 0,
    estimatedMonthlyCost: project.estimatedMonthlyCost ?? 0,
  };
}

function toAuthResponse(response: ApiAuthResponse): AuthResponse {
  return {
    ...response,
    user: {
      ...response.user,
      role: toAppRole(response.user.role),
    },
  };
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(AppStore);
  private readonly api = environment.apiUrl;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(map(toAuthResponse), tap((response) => this.applyAuthResponse(response)));
  }

  register(name: string, email: string, password: string, role: Role = "Architect"): Observable<AuthResponse> {
    return this.http
      .post<ApiAuthResponse>(`${this.api}/auth/register`, { name, email, password, role: toApiRole(role) })
      .pipe(map(toAuthResponse), tap((response) => this.applyAuthResponse(response)));
  }

  logout() {
    this.store.setUser(null);
    this.store.setToken(null);
  }

  private applyAuthResponse(response: AuthResponse) {
    this.store.setUser(response.user);
    this.store.setToken(response.token);
  }
}

@Injectable({ providedIn: "root" })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  list() {
    return this.http.get<ProjectListResponse>(`${this.api}/projects`).pipe(map(unwrapProjects), map((projects) => projects.map(toProject)));
  }

  get(id: string) {
    return this.http.get<ProjectResponse>(`${this.api}/projects/${id}`).pipe(map(unwrapProject), map(toProject));
  }

  create(project: Partial<Project>) {
    return this.http.post<ProjectResponse>(`${this.api}/projects`, project).pipe(map(unwrapProject), map(toProject));
  }
}

@Injectable({ providedIn: "root" })
export class DiscoveryService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  questions(projectId: string) {
    return this.http.get<DiscoveryQuestion[]>(`${this.api}/projects/${projectId}/discovery/questions`);
  }

  saveDraft(projectId: string, answers: DiscoveryAnswer[]) {
    return this.http.put<DiscoveryAnswer[]>(`${this.api}/projects/${projectId}/discovery/answers`, { answers });
  }
}

@Injectable({ providedIn: "root" })
export class ArchitectureModelService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  get(projectId: string) {
    return this.http.get<ArchitectureModel>(`${this.api}/projects/${projectId}/architecture-model`);
  }

  generate(projectId: string) {
    return this.http.post<GenerationJob>(`${this.api}/projects/${projectId}/architecture-model/generate`, {});
  }
}

@Injectable({ providedIn: "root" })
export class ArtifactService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  list(projectId: string, type?: string) {
    const params = type ? { type } : undefined;
    return this.http.get<ArtifactListResponse>(`${this.api}/projects/${projectId}/artifacts`, { params }).pipe(map((response) => unwrapArtifacts(response).map((artifact) => toArtifact(artifact, projectId))));
  }

  workspace(projectId: string) {
    return this.http.get<ArtifactWorkspaceResponse>(`${this.api}/projects/${projectId}/artifacts/workspace`).pipe(map((response) => toArtifactWorkspace(response, projectId)));
  }

  save(projectId: string, artifact: Artifact) {
    return this.http.put<Artifact>(`${this.api}/projects/${projectId}/artifacts/${artifact.id}`, artifact);
  }
}

@Injectable({ providedIn: "root" })
export class ExportService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  exportPackage(projectId: string, format: string) {
    return this.http.post<{ url: string; format: string }>(`${this.api}/projects/${projectId}/exports`, { format });
  }
}

@Injectable({ providedIn: "root" })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  get() {
    return this.http.get<Organization>(`${this.api}/organization`);
  }
}

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  list() {
    return this.http.get<User[]>(`${this.api}/users`);
  }
}

@Injectable({ providedIn: "root" })
export class AuditLogService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  list() {
    return this.http.get<AuditLog[]>(`${this.api}/audit-logs`);
  }
}

@Injectable({ providedIn: "root" })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  securityFindings(projectId: string) {
    return this.http.get<SecurityFinding[]>(`${this.api}/projects/${projectId}/security/findings`);
  }

  risks(projectId: string) {
    return this.http.get<ArchitectureModel["risks"]>(`${this.api}/projects/${projectId}/risks`);
  }

  cost(projectId: string) {
    return this.http.get<CostEstimate>(`${this.api}/projects/${projectId}/cost`);
  }

  presentation(projectId: string) {
    return this.http.get<string[]>(`${this.api}/projects/${projectId}/presentation`);
  }
}
