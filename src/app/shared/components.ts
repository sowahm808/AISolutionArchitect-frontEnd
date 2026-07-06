import { Component, Input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Artifact,
  CostEstimate,
  GenerationJob,
  Project,
  Risk,
  SecurityFinding,
} from "../models/domain";
@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [ngClass]="value?.toLowerCase()">{{
    value
  }}</span>`,
})
export class StatusBadgeComponent {
  @Input() value = "";
}
@Component({
  selector: "app-page-header",
  standalone: true,
  template: `<div class="page-header">
    <div>
      <p class="eyebrow">AI Solution Architect</p>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    <ng-content />
  </div>`,
})
export class PageHeaderComponent {
  @Input() title = "";
  @Input() subtitle = "";
}
@Component({
  selector: "app-empty-state",
  standalone: true,
  template: `<section class="empty">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button *ngIf="action" class="primary">{{ action }}</button>
  </section>`,
  imports: [CommonModule],
})
export class EmptyStateComponent {
  @Input() title = "Nothing here yet";
  @Input() message = "Start by creating or generating content.";
  @Input() action = "";
}
@Component({
  selector: "app-loading-skeleton",
  standalone: true,
  template: `<div class="skeleton" *ngFor="let i of [1, 2, 3]"></div>`,
  imports: [CommonModule],
})
export class LoadingSkeletonComponent {}
@Component({
  selector: "app-error-state",
  standalone: true,
  template: `<section class="error">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button class="secondary">Retry</button>
  </section>`,
})
export class ErrorStateComponent {
  @Input() title = "Something went wrong";
  @Input() message = "Please retry.";
}
@Component({
  selector: "app-project-card",
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `<article class="card project-card">
    <div class="split">
      <h3>{{ project.name }}</h3>
      <app-status-badge [value]="project.status" />
    </div>
    <p>
      {{ project.company }} · {{ project.cloudProvider }} ·
      {{ project.migrationType }}
    </p>
    <div class="progress">
      <span [style.width.%]="project.completion"></span>
    </div>
    <dl>
      <div>
        <dt>Artifacts</dt>
        <dd>{{ project.generatedArtifacts }}</dd>
      </div>
      <div>
        <dt>Risks</dt>
        <dd>{{ project.openRisks }}</dd>
      </div>
      <div>
        <dt>Security</dt>
        <dd>{{ project.securityScore }}%</dd>
      </div>
      <div>
        <dt>Monthly</dt>
        <dd>{{ project.estimatedMonthlyCost | currency }}</dd>
      </div>
    </dl>
  </article>`,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
@Component({
  selector: "app-generation-progress",
  standalone: true,
  imports: [CommonModule],
  template: `<section class="card">
    <div class="split">
      <h3>Generation progress</h3>
      <strong>{{ job?.status || "idle" }}</strong>
    </div>
    <div class="progress">
      <span [style.width.%]="job?.progress || 0"></span>
    </div>
    <p>
      {{
        job?.message || "Ready to generate enterprise architecture artifacts."
      }}
    </p>
    <div class="chips">
      <span *ngFor="let c of categories()">{{ c[0] }} {{ c[1] }}%</span>
    </div>
  </section>`,
})
export class GenerationProgressComponent {
  @Input() job: GenerationJob | null = null;
  categories() {
    return Object.entries(this.job?.categories ?? {});
  }
}
@Component({
  selector: "app-markdown-viewer",
  standalone: true,
  template: `<div class="markdown" [innerHTML]="html()"></div>`,
})
export class MarkdownViewerComponent {
  @Input() content = "";
  html() {
    return this.content
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/\n/g, "<br>");
  }
}
@Component({
  selector: "app-mermaid-viewer",
  standalone: true,
  template: `<div class="diagram">
    <pre>{{ source }}</pre>
    <p class="muted">
      Mermaid preview placeholder with source/export controls.
    </p>
  </div>`,
})
export class MermaidViewerComponent {
  @Input() source = "";
}
@Component({
  selector: "app-code-editor",
  standalone: true,
  imports: [FormsModule],
  template: `<textarea
    class="code"
    [(ngModel)]="content"
    [attr.aria-label]="language + ' editor'"
  ></textarea>`,
})
export class CodeEditorComponent {
  @Input() content = "";
  @Input() language = "yaml";
}
@Component({
  selector: "app-artifact-tabs",
  standalone: true,
  imports: [CommonModule],
  template: `<nav class="tabs">
      <button
        *ngFor="let a of artifacts"
        (click)="selected = a"
        [class.active]="selected?.id === a.id"
      >
        {{ a.type }}
      </button>
    </nav>
    <ng-content />`,
})
export class ArtifactTabsComponent {
  @Input() artifacts: Artifact[] = [];
  selected?: Artifact;
}
@Component({
  selector: "app-risk-table",
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `<table>
    <thead>
      <tr>
        <th>Risk</th>
        <th>Category</th>
        <th>Severity</th>
        <th>Probability</th>
        <th>Impact</th>
        <th>Mitigation</th>
        <th>Owner</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let r of risks">
        <td>{{ r.risk }}</td>
        <td>{{ r.category }}</td>
        <td><app-status-badge [value]="r.severity" /></td>
        <td>{{ r.probability }}</td>
        <td>{{ r.impact }}</td>
        <td>{{ r.mitigation }}</td>
        <td>{{ r.owner }}</td>
        <td>{{ r.status }}</td>
      </tr>
    </tbody>
  </table>`,
})
export class RiskTableComponent {
  @Input() risks: Risk[] = [];
}
@Component({
  selector: "app-security-finding-card",
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `<article class="card">
    <div class="split">
      <h3>{{ finding.title }}</h3>
      <app-status-badge [value]="finding.severity" />
    </div>
    <p>{{ finding.area }}</p>
    <p>{{ finding.recommendation }}</p>
  </article>`,
})
export class SecurityFindingCardComponent {
  @Input({ required: true }) finding!: SecurityFinding;
}
@Component({
  selector: "app-cost-breakdown",
  standalone: true,
  imports: [CommonModule],
  template: `<div class="grid">
    <div class="card" *ngFor="let i of items()">
      <p>{{ i[0] }}</p>
      <h2>{{ i[1] | currency }}</h2>
    </div>
  </div>`,
})
export class CostBreakdownComponent {
  @Input({ required: true }) cost!: CostEstimate;
  items() {
    return Object.entries(this.cost).filter(
      ([_, v]) => typeof v === "number",
    ) as [string, number][];
  }
}
@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  template: `<div class="card">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button class="danger">Confirm</button>
  </div>`,
})
export class ConfirmDialogComponent {
  @Input() title = "Confirm";
  @Input() message = "Are you sure?";
}
