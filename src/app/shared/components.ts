import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Artifact, CostEstimate, GenerationJob, Project, Risk, SecurityFinding } from "../models/domain";
import { MATERIAL_IMPORTS } from "../material.imports";

const SHARED_IMPORTS = [CommonModule, FormsModule, ...MATERIAL_IMPORTS];
class SharedComponentBase { componentName = ""; value = ""; title = ""; subtitle = ""; message = ""; action = ""; project: any = {}; job: any = null; content = ""; source = ""; language = "yaml"; artifacts: any[] = []; selected: any; risks: any[] = []; riskColumns = ["risk", "category", "severity", "probability", "impact", "mitigation", "owner", "status"]; finding: any = {}; cost: any = {}; categories() { return Object.entries(this.job?.categories ?? {}); } html() { return this.content.replace(/^# (.*)$/gm, "<h1>$1</h1>").replace(/\n/g, "<br>"); } items() { return Object.entries(this.cost).filter(([_, v]) => typeof v === "number") as [string, number][]; } }

@Component({ selector: "app-status-badge", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class StatusBadgeComponent extends SharedComponentBase { componentName = "status"; @Input() value = ""; }
@Component({ selector: "app-page-header", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class PageHeaderComponent extends SharedComponentBase { componentName = "header"; @Input() title = ""; @Input() subtitle = ""; }
@Component({ selector: "app-empty-state", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class EmptyStateComponent extends SharedComponentBase { componentName = "empty"; @Input() title = "Nothing here yet"; @Input() message = "Start by creating or generating content."; @Input() action = ""; }
@Component({ selector: "app-loading-skeleton", standalone: true, template: `<div class="skeleton" *ngFor="let i of [1, 2, 3]"></div>`, styles: [`.skeleton{animation:pulse 1.4s ease-in-out infinite;background:var(--mat-sys-surface-container);border-radius:16px;height:96px;margin:12px 0}@keyframes pulse{0%,100%{opacity:.65}50%{opacity:1}}`], imports: [CommonModule] })
export class LoadingSkeletonComponent {}
@Component({ selector: "app-error-state", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class ErrorStateComponent extends SharedComponentBase { componentName = "error"; @Input() title = "Something went wrong"; @Input() message = "Please retry."; }
@Component({ selector: "app-project-card", standalone: true, imports: [CommonModule, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./components.html", styleUrl: "./components.css" })
export class ProjectCardComponent extends SharedComponentBase { componentName = "project"; @Input({ required: true }) project!: Project; }
@Component({ selector: "app-generation-progress", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class GenerationProgressComponent extends SharedComponentBase { componentName = "progress"; @Input() job: GenerationJob | null = null; categories() { return Object.entries(this.job?.categories ?? {}); } }
@Component({ selector: "app-markdown-viewer", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class MarkdownViewerComponent extends SharedComponentBase { componentName = "markdown"; @Input() content = ""; html() { return this.content.replace(/^# (.*)$/gm, "<h1>$1</h1>").replace(/\n/g, "<br>"); } }
@Component({ selector: "app-mermaid-viewer", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class MermaidViewerComponent extends SharedComponentBase { componentName = "mermaid"; @Input() source = ""; }
@Component({ selector: "app-code-editor", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class CodeEditorComponent extends SharedComponentBase { componentName = "code"; @Input() content = ""; @Input() language = "yaml"; }
@Component({ selector: "app-artifact-tabs", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class ArtifactTabsComponent extends SharedComponentBase { componentName = "tabs"; @Input() artifacts: Artifact[] = []; selected: Artifact | undefined; }
@Component({ selector: "app-risk-table", standalone: true, imports: [CommonModule, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./components.html", styleUrl: "./components.css" })
export class RiskTableComponent extends SharedComponentBase { componentName = "risk"; riskColumns = ["risk", "category", "severity", "probability", "impact", "mitigation", "owner", "status"]; @Input() risks: Risk[] = []; }
@Component({ selector: "app-security-finding-card", standalone: true, imports: [CommonModule, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./components.html", styleUrl: "./components.css" })
export class SecurityFindingCardComponent extends SharedComponentBase { componentName = "finding"; @Input({ required: true }) finding!: SecurityFinding; }
@Component({ selector: "app-cost-breakdown", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class CostBreakdownComponent extends SharedComponentBase { componentName = "cost"; @Input({ required: true }) cost!: CostEstimate; items() { return Object.entries(this.cost).filter(([_, v]) => typeof v === "number") as [string, number][]; } }
@Component({ selector: "app-confirm-dialog", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./components.html", styleUrl: "./components.css" })
export class ConfirmDialogComponent extends SharedComponentBase { componentName = "confirm"; @Input() title = "Confirm"; @Input() message = "Are you sure?"; }
