import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MATERIAL_IMPORTS } from "../material.imports";

export const SHARED_IMPORTS = [CommonModule, FormsModule, ...MATERIAL_IMPORTS];
