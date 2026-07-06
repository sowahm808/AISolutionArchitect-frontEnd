import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppStore } from "../core/app.store";
import { MATERIAL_IMPORTS } from "../material.imports";

interface ShellNavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly requiresProject?: boolean;
}

const SHELL_NAVIGATION: readonly ShellNavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Projects", path: "/projects", icon: "workspaces" },
  { label: "Architecture Model", path: "architecture-model", icon: "account_tree", requiresProject: true },
  { label: "Artifacts", path: "artifacts", icon: "description", requiresProject: true },
  { label: "Diagrams", path: "diagrams", icon: "schema", requiresProject: true },
  { label: "ADRs", path: "adrs", icon: "fact_check", requiresProject: true },
  { label: "Infrastructure", path: "infrastructure", icon: "cloud", requiresProject: true },
  { label: "Kubernetes", path: "kubernetes", icon: "hub", requiresProject: true },
  { label: "CI/CD", path: "cicd", icon: "sync_alt", requiresProject: true },
  { label: "Security", path: "security", icon: "security", requiresProject: true },
  { label: "Risks", path: "risks", icon: "warning", requiresProject: true },
  { label: "Cost", path: "cost", icon: "payments", requiresProject: true },
  { label: "Presentation", path: "presentation", icon: "slideshow", requiresProject: true },
  { label: "Exports", path: "export", icon: "download", requiresProject: true },
  { label: "Settings", path: "/settings/organization", icon: "settings" },
];

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ...MATERIAL_IMPORTS],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.css",
})
export class AppShellComponent {
  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);
  protected readonly nav = SHELL_NAVIGATION;

  protected navPath(item: ShellNavigationItem) {
    if (!item.requiresProject) return item.path;
    const projectId = this.activeProjectId();
    return projectId ? `/projects/${projectId}/${item.path}` : "/projects";
  }

  private activeProjectId() {
    return this.store.currentProject()?.id ?? this.router.url.match(/\/projects\/([^/]+)/)?.[1] ?? "";
  }
}
