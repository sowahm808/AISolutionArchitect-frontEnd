import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { PageHeaderComponent, ProjectCardComponent, GenerationProgressComponent, RiskTableComponent, SecurityFindingCardComponent, CostBreakdownComponent, MarkdownViewerComponent, MermaidViewerComponent, CodeEditorComponent } from "../shared/components";
import { mock } from "../services/api.service";
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
  page: string = "simple"; projects = signal(mock.projects); form: any = null; project: any = mock.projects[0]; job: any = null; questions: any[] = []; model: any = mock.model; sections: any[] = []; artifacts: any[] = []; selected: any = mock.artifacts[0]; findings: any[] = []; risks: any[] = []; cost: any = mock.cost; slides: string[] = []; items: string[] = [];
  get title() { return META[this.page as keyof typeof META][0]; } get subtitle() { return META[this.page as keyof typeof META][1]; } get actionLink() { return META[this.page as keyof typeof META][2]; } get actionLabel() { return META[this.page as keyof typeof META][3]; }
}

@Component({ selector: "app-dashboard", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class DashboardComponent extends MaterialPageBase { override page = "dashboard"; override projects = signal(mock.projects); }
@Component({ selector: "app-project-list", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ProjectListComponent extends MaterialPageBase { override page = "projects"; override projects = signal(mock.projects); }
@Component({ selector: "app-create-project", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class CreateProjectComponent extends MaterialPageBase { override page = "create"; fb = inject(FormBuilder); form = this.fb.nonNullable.group({ name: ["", Validators.required], company: [""], industry: [""], cloudProvider: ["Azure"], migrationType: [""], businessProblem: [""], currentArchitecture: [""], targetGoal: [""], compliance: [""], budget: [""], timeline: [""], notes: [""] }); }
@Component({ selector: "app-project-overview", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ProjectOverviewComponent extends MaterialPageBase { override page = "overview"; project = mock.projects[0]; job = { id: "j1", status: "queued" as const, progress: 15, categories: { discovery: 60, model: 0 }, message: "Waiting for architect inputs" }; }
@Component({ selector: "app-discovery", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class DiscoveryComponent extends MaterialPageBase { override page = "discovery"; questions = mock.questions; }
@Component({ selector: "app-model", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ArchitectureModelComponent extends MaterialPageBase { override page = "model"; model = mock.model; sections = Object.entries(mock.model).filter(([k]) => k !== "risks").map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v]); }
@Component({ selector: "app-artifacts", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class ArtifactsComponent extends MaterialPageBase { override page = "artifacts"; artifacts = mock.artifacts; selected = mock.artifacts[0]; }
@Component({ selector: "app-security", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class SecurityComponent extends MaterialPageBase { override page = "security"; findings = mock.findings; }
@Component({ selector: "app-risks", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class RisksComponent extends MaterialPageBase { override page = "risks"; risks = mock.risks; }
@Component({ selector: "app-cost", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class CostComponent extends MaterialPageBase { override page = "cost"; cost = mock.cost; }
@Component({ selector: "app-presentation", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class PresentationComponent extends MaterialPageBase { override page = "presentation"; slides = ["Executive Summary", "Business Problem", "Current State", "Future State", "Architecture Overview", "Benefits", "Cost Estimate", "Risk Summary", "Roadmap", "Recommendation"]; }
@Component({ selector: "app-simple", standalone: true, imports: MAIN_IMPORTS, templateUrl: "./main.pages.html", styleUrl: "./main.pages.css" })
export class SimplePageComponent extends MaterialPageBase { override page = "simple"; items = ["Version selector", "Clear empty states", "Download ZIP, PDF, DOCX, PPTX", "Role-based actions"]; }
