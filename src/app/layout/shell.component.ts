import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppStore } from "../core/app.store";
import { MATERIAL_IMPORTS } from "../material.imports";

interface ShellNavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

const SHELL_NAVIGATION: readonly ShellNavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Projects", path: "/projects", icon: "workspaces" },
  {
    label: "Architecture Model",
    path: "/projects/p1/architecture-model",
    icon: "account_tree",
  },
  { label: "Artifacts", path: "/projects/p1/artifacts", icon: "description" },
  { label: "Diagrams", path: "/projects/p1/diagrams", icon: "schema" },
  { label: "ADRs", path: "/projects/p1/adrs", icon: "fact_check" },
  { label: "Infrastructure", path: "/projects/p1/infrastructure", icon: "cloud" },
  { label: "Kubernetes", path: "/projects/p1/kubernetes", icon: "hub" },
  { label: "CI/CD", path: "/projects/p1/cicd", icon: "sync_alt" },
  { label: "Security", path: "/projects/p1/security", icon: "security" },
  { label: "Risks", path: "/projects/p1/risks", icon: "warning" },
  { label: "Cost", path: "/projects/p1/cost", icon: "payments" },
  { label: "Presentation", path: "/projects/p1/presentation", icon: "slideshow" },
  { label: "Exports", path: "/projects/p1/export", icon: "download" },
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
  protected readonly nav = SHELL_NAVIGATION;
}
