import { Component, Input } from "@angular/core";
import { SHARED_IMPORTS } from "../shared-imports";

@Component({ selector: "app-empty-state", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./empty-state.component.html", styleUrl: "./empty-state.component.css" })
export class EmptyStateComponent {
  @Input() title = "Nothing here yet";
  @Input() message = "Start by creating or generating content.";
  @Input() action = "";
}
