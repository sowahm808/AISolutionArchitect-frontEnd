import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { AppStore } from "../core/app.store";
import {
  ArchitectureModel,
  Artifact,
  AuditLog,
  CostEstimate,
  DiscoveryAnswer,
  DiscoveryQuestion,
  GenerationJob,
  Organization,
  Project,
  SecurityFinding,
  User,
} from "../models/domain";

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(AppStore);
  private readonly api = environment.apiUrl;

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, { email, password })
      .pipe(tap((response) => this.applyAuthResponse(response)));
  }

  register(name: string, email: string, password: string, role = "Architect"): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, { name, email, password, role })
      .pipe(tap((response) => this.applyAuthResponse(response)));
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
    return this.http.get<Project[]>(`${this.api}/projects`);
  }

  get(id: string) {
    return this.http.get<Project>(`${this.api}/projects/${id}`);
  }

  create(project: Partial<Project>) {
    return this.http.post<Project>(`${this.api}/projects`, project);
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
    return this.http.get<Artifact[]>(`${this.api}/projects/${projectId}/artifacts`, { params });
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
