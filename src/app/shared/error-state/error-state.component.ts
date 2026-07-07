import { Component, Input } from "@angular/core";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-error-state", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./error-state.component.html", styleUrl: "./error-state.component.css" })
export class ErrorStateComponent { @Input() title = "Something went wrong"; @Input() message = "Please retry."; }
