import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
@Component({ selector: "app-markdown-viewer", standalone: true, imports: [CommonModule], templateUrl: "./markdown-viewer.component.html", styleUrl: "./markdown-viewer.component.css" })
export class MarkdownViewerComponent { @Input() content = ""; html() { return this.content.replace(/^# (.*)$/gm, "<h1>$1</h1>").replace(/\n/g, "<br>"); } }
