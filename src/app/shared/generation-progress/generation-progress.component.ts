import { Component, Input } from "@angular/core";
import { GenerationJob } from "../../models/domain";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-generation-progress", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./generation-progress.component.html", styleUrl: "./generation-progress.component.css" })
export class GenerationProgressComponent { @Input() job: GenerationJob | null = null; categories() { return Object.entries(this.job?.categories ?? {}); } }
