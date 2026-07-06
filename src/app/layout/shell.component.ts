import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppStore } from "../core/app.store";
import { MATERIAL_IMPORTS } from "../material.imports";

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ...MATERIAL_IMPORTS],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.css",
})
export class AppShellComponent {
  store = inject(AppStore);
  nav = [
    ["Dashboard", "/dashboard", "dashboard"], ["Projects", "/projects", "workspaces"], ["Architecture Model", "/projects/p1/architecture-model", "account_tree"], ["Artifacts", "/projects/p1/artifacts", "description"], ["Diagrams", "/projects/p1/diagrams", "schema"], ["ADRs", "/projects/p1/adrs", "fact_check"], ["Infrastructure", "/projects/p1/infrastructure", "cloud"], ["Kubernetes", "/projects/p1/kubernetes", "hub"], ["CI/CD", "/projects/p1/cicd", "sync_alt"], ["Security", "/projects/p1/security", "security"], ["Risks", "/projects/p1/risks", "warning"], ["Cost", "/projects/p1/cost", "payments"], ["Presentation", "/projects/p1/presentation", "slideshow"], ["Exports", "/projects/p1/export", "download"], ["Settings", "/settings/organization", "settings"],
  ].map(([label, path, icon]) => ({ label, path, icon }));
}
