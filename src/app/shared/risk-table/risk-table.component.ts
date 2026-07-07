import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MATERIAL_IMPORTS } from "../../material.imports";
import { Risk } from "../../models/domain";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";
@Component({ selector: "app-risk-table", standalone: true, imports: [CommonModule, StatusBadgeComponent, ...MATERIAL_IMPORTS], templateUrl: "./risk-table.component.html", styleUrl: "./risk-table.component.css" })
export class RiskTableComponent { riskColumns = ["risk", "category", "severity", "probability", "impact", "mitigation", "owner", "status"]; @Input() risks: Risk[] = []; }
