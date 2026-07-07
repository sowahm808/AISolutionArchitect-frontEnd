import { Component, Input } from "@angular/core";
import { CostEstimate } from "../../models/domain";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-cost-breakdown", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./cost-breakdown.component.html", styleUrl: "./cost-breakdown.component.css" })
export class CostBreakdownComponent { @Input({ required: true }) cost!: CostEstimate; items() { return Object.entries(this.cost).filter(([_, v]) => typeof v === "number") as [string, number][]; } }
