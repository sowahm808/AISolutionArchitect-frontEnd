import { Component, Input } from "@angular/core";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-code-editor", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./code-editor.component.html", styleUrl: "./code-editor.component.css" })
export class CodeEditorComponent { @Input() content = ""; @Input() language = "yaml"; }
