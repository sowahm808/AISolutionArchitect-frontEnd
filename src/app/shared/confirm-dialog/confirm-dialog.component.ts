import { Component, Input } from "@angular/core";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-confirm-dialog", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./confirm-dialog.component.html", styleUrl: "./confirm-dialog.component.css" })
export class ConfirmDialogComponent { @Input() title = "Confirm"; @Input() message = "Are you sure?"; }
