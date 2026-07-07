import { Component, Input } from "@angular/core";
import { Artifact } from "../../models/domain";
import { SHARED_IMPORTS } from "../shared-imports";
@Component({ selector: "app-artifact-tabs", standalone: true, imports: SHARED_IMPORTS, templateUrl: "./artifact-tabs.component.html" })
export class ArtifactTabsComponent { @Input() artifacts: Artifact[] = []; selected: Artifact | undefined; }
