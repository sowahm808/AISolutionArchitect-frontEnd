import { Component, OnInit, inject } from "@angular/core";
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppStore } from "../core/app.store";
import { AuthService, ProjectService } from "../services/api.service";
import { Role } from "../models/domain";
import { MATERIAL_IMPORTS } from "../material.imports";
import { catchError, filter, of } from "rxjs";

interface ShellNavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly requiresProject?: boolean;
  readonly roles?: readonly Role[];
}

const SHELL_NAVIGATION: readonly ShellNavigationItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Projects", path: "/projects", icon: "workspaces" },
  { label: "Discovery", path: "discovery", icon: "travel_explore", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Architecture Model", path: "architecture-model", icon: "account_tree", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Artifacts", path: "artifacts", icon: "description", requiresProject: true },
  { label: "Diagrams", path: "diagrams", icon: "schema", requiresProject: true },
  { label: "ADRs", path: "adrs", icon: "fact_check", requiresProject: true },
  { label: "Infrastructure", path: "infrastructure", icon: "cloud", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Kubernetes", path: "kubernetes", icon: "hub", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "CI/CD", path: "cicd", icon: "sync_alt", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Security", path: "security", icon: "security", requiresProject: true, roles: ["Admin", "Architect", "Security"] },
  { label: "Risks", path: "risks", icon: "warning", requiresProject: true, roles: ["Admin", "Architect", "Security"] },
  { label: "Cost", path: "cost", icon: "payments", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Presentation", path: "presentation", icon: "slideshow", requiresProject: true },
  { label: "Exports", path: "export", icon: "download", requiresProject: true, roles: ["Admin", "Architect"] },
  { label: "Profile", path: "/profile", icon: "person" },
  { label: "Organization", path: "/settings/organization", icon: "settings", roles: ["Admin", "Architect"] },
  { label: "Users", path: "/settings/users", icon: "group", roles: ["Admin"] },
  { label: "Audit Logs", path: "/audit-logs", icon: "manage_search", roles: ["Admin"] },
];

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ...MATERIAL_IMPORTS],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.css",
})
export class AppShellComponent implements OnInit {
  protected readonly helpText =
    "Use the side navigation to switch workspaces, then open project sections such as Discovery, Artifacts, Security, Risks, and Cost.";

  protected readonly store = inject(AppStore);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  protected readonly nav = SHELL_NAVIGATION;

  ngOnInit() {
    this.syncProjectContext();
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => this.syncProjectContext());
  }

  protected visibleNav() {
    return this.nav.filter((item) => !item.roles || this.store.hasAnyRole(item.roles));
  }

  protected primaryNav() {
    return this.visibleNav().filter((item) => !item.requiresProject);
  }

  protected projectNav() {
    return this.visibleNav().filter((item) => item.requiresProject);
  }

  protected projectNavDisabled() {
    return !this.activeProjectId();
  }

  protected trackNavItem(_index: number, item: ShellNavigationItem) {
    return `${item.label}:${item.path}`;
  }

  protected keepDisabledProjectNavInPlace(event: MouseEvent) {
    if (!this.projectNavDisabled()) return;

    event.preventDefault();
    event.stopPropagation();
  }

  protected navPath(item: ShellNavigationItem) {
    if (!item.requiresProject) return item.path;
    const projectId = this.activeProjectId();
    return projectId ? `/projects/${projectId}/${item.path}` : "/projects";
  }

  protected logout() {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }

  private activeProjectId() {
    return this.store.currentProject()?.id ?? this.urlProjectId() ?? "";
  }

  private urlProjectId() {
    const match = this.router.url.match(/\/projects\/([^/?#]+)/);
    if (!match || match[1] === "new") return "";
    return decodeURIComponent(match[1]);
  }

  private syncProjectContext() {
    const projectId = this.urlProjectId();
    if (!projectId) {
      this.store.currentProject.set(null);
      return;
    }

    if (this.store.currentProject()?.id === projectId) return;

    this.projectService.get(projectId).pipe(catchError(() => of(null))).subscribe((project) => this.store.currentProject.set(project));
  }
}
