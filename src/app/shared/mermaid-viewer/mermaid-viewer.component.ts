import { Component, Input } from "@angular/core";
@Component({ selector: "app-mermaid-viewer", standalone: true, templateUrl: "./mermaid-viewer.component.html", styleUrl: "./mermaid-viewer.component.css" })
export class MermaidViewerComponent { @Input() source = ""; }
