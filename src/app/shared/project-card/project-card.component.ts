import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Project } from "../../models/domain";
import { MATERIAL_IMPORTS } from "../../material.imports";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
@Component({ selector: "app-project-card", standalone: true, imports: [CommonModule, RouterLink, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./project-card.component.html", styleUrl: "./project-card.component.css" })
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

  get subtitle() {
    return [this.project.company, this.project.cloudProvider, this.project.migrationType].filter(Boolean).join(" · ");
  }
}
