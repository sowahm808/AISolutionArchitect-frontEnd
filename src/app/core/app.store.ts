import { Injectable, computed, signal } from "@angular/core";
import {
  ArchitectureModel,
  Artifact,
  GenerationJob,
  Organization,
  Project,
  User,
} from "../models/domain";
@Injectable({ providedIn: "root" })
export class AppStore {
  user = signal<User | null>(null);
  token = signal(localStorage.getItem("asa_token"));
  organization = signal<Organization | null>(null);
  projects = signal<Project[]>([]);
  currentProject = signal<Project | null>(null);
  model = signal<ArchitectureModel | null>(null);
  artifacts = signal<Artifact[]>([]);
  job = signal<GenerationJob | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.token());
  hasRole = (roles: string[]) => roles.includes(this.user()?.role ?? "");
  setToken(t: string | null) {
    t
      ? localStorage.setItem("asa_token", t)
      : localStorage.removeItem("asa_token");
    this.token.set(t);
  }
}
