import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MATERIAL_IMPORTS } from "../../material.imports";
import { SecurityFinding } from "../../models/domain";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
@Component({ selector: "app-security-finding-card", standalone: true, imports: [CommonModule, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./security-finding-card.component.html", styleUrl: "./security-finding-card.component.css" })
export class SecurityFindingCardComponent { @Input({ required: true }) finding!: SecurityFinding; }
