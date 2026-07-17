import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { catchError, finalize, of } from "rxjs";
import { PageHeaderComponent, ProjectCardComponent, GenerationProgressComponent, RiskTableComponent, SecurityFindingCardComponent, CostBreakdownComponent, MarkdownViewerComponent, MermaidViewerComponent, CodeEditorComponent } from "../shared/components";
import { ArchitectureModelService, ArtifactService, DiscoveryService, ProjectService, ReviewService } from "../services/api.service";
import { AppStore } from "../core/app.store";
import { ArchitectureModel, Artifact, CostEstimate, DiscoveryQuestion, GenerationJob, Project, Risk, SecurityFinding } from "../models/domain";
import { MATERIAL_IMPORTS } from "../material.imports";

const MAIN_IMPORTS = [CommonModule, RouterLink, ReactiveFormsModule, PageHeaderComponent, ProjectCardComponent, GenerationProgressComponent, RiskTableComponent, SecurityFindingCardComponent, CostBreakdownComponent, MarkdownViewerComponent, MermaidViewerComponent, CodeEditorComponent, ...MATERIAL_IMPORTS];
const META = {
  dashboard: ["Dashboard", "Track initiatives, generation status, risk and cost.", "/projects/new", "New Project"],
  projects: ["Projects", "Enterprise architecture project portfolio.", "/projects/new", "Create"],
  create: ["Create Project", "Describe the initiative so the architect can start discovery.", "", ""],
  overview: ["Project Overview", "Canonical workspace and generation controls.", "discovery", "Continue Discovery"],
  discovery: ["Discovery Interview", "Structured senior architect discovery, not a chatbot.", "", ""],
  model: ["Architecture Model", "Canonical model used to generate all artifacts.", "", ""],
  artifacts: ["Artifact Workspace", "Review, edit, regenerate, copy and download architecture outputs.", "", ""],
  security: ["Security Review", "Identity, network, encryption, secrets, RBAC, compliance and threat model.", "", ""],
  risks: ["Risk Assessment", "Prioritized migration and architecture risk register.", "", ""],
  cost: ["Cost Estimate", "Monthly, yearly and category-level estimates with assumptions.", "", ""],
  presentation: ["Executive Presentation Preview", "Board-ready narrative and slide outline.", "", ""],
  simple: ["Workspace", "Enterprise architecture content.", "", ""],
} as const;

class MaterialPageBase {
  protected readonly route = inject(ActivatedRoute);
  protected readonly projectService = inject(ProjectService);
  protected readonly store = inject(AppStore);
  page: string = "simple";
  loading = signal(false);
  error = signal<string | null>(null);
  projects = signal<Project[]>([]);
  project = signal<Project | null>(null);
  job = signal<GenerationJob | null>(null);
  questions = signal<DiscoveryQuestion[]>([]);
  model = signal<ArchitectureModel | null>(null);
  sections = signal<[string, string][]>([]);
  protected formatModelValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "Not provided";
    if (Array.isArray(value)) {
      if (!value.length) return "None provided";
      return value.map((item) => this.formatModelValue(item)).join("; ");
    }
    if (typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined && entryValue !== "");
      if (!entries.length) return "Not provided";
      return entries.map(([key, entryValue]) => `${this.formatModelLabel(key)}: ${this.formatModelValue(entryValue)}`).join("; ");
    }
    return String(value);
  }

  protected formatModelLabel(key: string): string {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }
  artifacts = signal<Artifact[]>([]);
  selected = signal<Artifact | null>(null);
  findings = signal<SecurityFinding[]>([]);
  risks = signal<Risk[]>([]);
  cost = signal<CostEstimate | null>(null);
  slides = signal<string[]>([]);
  items = signal<string[]>([]);
  form: any = null;
  projectId = computed(() => this.route.snapshot.paramMap.get("projectId") ?? "");
  get title() { return META[this.page as keyof typeof META][0]; }
  get subtitle() { return META[this.page as keyof typeof META][1]; }
  get actionLink() { return META[this.page as keyof typeof META][2]; }
  get actionLabel() { return META[this.page as keyof typeof META][3]; }

  protected loadProject() {
    const id = this.projectId();
    if (!id) return;
    this.projectService.get(id).pipe(catchError((error) => this.handleError(error))).subscribe((project) => { this.project.set(project); this.store.currentProject.set(project); });
  }

  protected handleError(error: unknown) {
    this.error.set(error instanceof Error ? error.message : "Unable to load API data.");
    return of(null as never);
  }
}

@Component({ selector: "app-dashboard", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class DashboardComponent extends MaterialPageBase implements OnInit { override page = "dashboard"; ngOnInit() { this.loading.set(true); this.projectService.list().pipe(catchError((e) => this.handleError(e)), finalize(() => this.loading.set(false))).subscribe((projects) => this.projects.set(projects ?? [])); } }
@Component({ selector: "app-project-list", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ProjectListComponent extends DashboardComponent { override page = "projects"; }
@Component({ selector: "app-create-project", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class CreateProjectComponent extends MaterialPageBase { override page = "create"; private readonly fb = inject(FormBuilder); private readonly router = inject(Router); form = this.fb.nonNullable.group({ name: ["", Validators.required], company: [""], industry: [""], cloudProvider: ["Azure"], migrationType: [""], businessProblem: [""], currentArchitecture: [""], targetGoal: [""], compliance: [""], budget: [""], timeline: [""], notes: [""] }); submit() { if (this.form.invalid) return; this.projectService.create(this.form.getRawValue() as Partial<Project>).pipe(catchError((e) => this.handleError(e))).subscribe((project) => project && this.router.navigate(["/projects", project.id, "discovery"])); } }
@Component({ selector: "app-project-overview", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ProjectOverviewComponent extends MaterialPageBase implements OnInit { override page = "overview"; ngOnInit() { this.loadProject(); } }
@Component({ selector: "app-discovery", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class DiscoveryComponent extends MaterialPageBase implements OnInit {
  override page = "discovery";
  private readonly discovery = inject(DiscoveryService);
  private readonly architecture = inject(ArchitectureModelService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.discovery.questions(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((questions) => this.questions.set(questions ?? []));
  }

  generateArchitecture() {
    const projectId = this.projectId();
    if (!projectId || this.loading()) return;

    this.error.set(null);
    this.loading.set(true);
    this.architecture.generate(projectId).pipe(
      catchError((e) => this.handleError(e)),
      finalize(() => this.loading.set(false)),
    ).subscribe((job) => {
      if (!job) return;
      this.job.set(job);
      this.router.navigate(["/projects", projectId, "architecture-model"]);
    });
  }
}
@Component({ selector: "app-model", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ArchitectureModelComponent extends MaterialPageBase implements OnInit {
  override page = "model";
  private readonly architecture = inject(ArchitectureModelService);

  ngOnInit() {
    this.architecture.get(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((model) => {
      if (!model) return;
      this.model.set(model);
      this.sections.set(Object.entries(model)
        .filter(([key]) => !["risks", "id", "projectId", "createdAt"].includes(key))
        .map(([key, value]) => [this.formatModelLabel(key), this.formatModelValue(value)]));
    });
  }
}
@Component({ selector: "app-artifacts", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ArtifactsComponent extends MaterialPageBase implements OnInit { override page = "artifacts"; private readonly artifactService = inject(ArtifactService); ngOnInit() { this.artifactService.list(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((artifacts) => { this.artifacts.set(artifacts ?? []); this.selected.set(artifacts?.[0] ?? null); }); } }
@Component({ selector: "app-security", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class SecurityComponent extends MaterialPageBase implements OnInit { override page = "security"; private readonly review = inject(ReviewService); ngOnInit() { this.review.securityFindings(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((findings) => this.findings.set(findings ?? [])); } }
@Component({ selector: "app-risks", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class RisksComponent extends MaterialPageBase implements OnInit { override page = "risks"; private readonly review = inject(ReviewService); ngOnInit() { this.review.risks(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((risks) => this.risks.set(risks ?? [])); } }
@Component({ selector: "app-cost", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class CostComponent extends MaterialPageBase implements OnInit { override page = "cost"; private readonly review = inject(ReviewService); ngOnInit() { this.review.cost(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((cost) => this.cost.set(cost)); } }
@Component({ selector: "app-presentation", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class PresentationComponent extends MaterialPageBase implements OnInit { override page = "presentation"; private readonly review = inject(ReviewService); ngOnInit() { this.review.presentation(this.projectId()).pipe(catchError((e) => this.handleError(e))).subscribe((slides) => this.slides.set(slides ?? [])); } }
@Component({ selector: "app-simple", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class SimplePageComponent extends MaterialPageBase { override page = "simple"; }
