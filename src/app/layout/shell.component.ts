import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppStore } from "../core/app.store";
@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="shell">
    <aside>
      <h2>AI Solution Architect</h2>
      <a
        *ngFor="let n of nav"
        [routerLink]="n.path"
        routerLinkActive="active"
        >{{ n.label }}</a
      >
    </aside>
    <main>
      <header>
        <span>Enterprise architecture workspace</span
        ><strong>{{ store.user()?.name || "Architect" }}</strong>
      </header>
      <router-outlet />
    </main>
  </div>`,
})
export class AppShellComponent {
  store = inject(AppStore);
  nav = [
    ["Dashboard", "/dashboard"],
    ["Projects", "/projects"],
    ["Architecture Model", "/projects/p1/architecture-model"],
    ["Artifacts", "/projects/p1/artifacts"],
    ["Diagrams", "/projects/p1/diagrams"],
    ["ADRs", "/projects/p1/adrs"],
    ["Infrastructure", "/projects/p1/infrastructure"],
    ["Kubernetes", "/projects/p1/kubernetes"],
    ["CI/CD", "/projects/p1/cicd"],
    ["Security", "/projects/p1/security"],
    ["Risks", "/projects/p1/risks"],
    ["Cost", "/projects/p1/cost"],
    ["Presentation", "/projects/p1/presentation"],
    ["Exports", "/projects/p1/export"],
    ["Settings", "/settings/organization"],
  ].map(([label, path]) => ({ label, path }));
}
