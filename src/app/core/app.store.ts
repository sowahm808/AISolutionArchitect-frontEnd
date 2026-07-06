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
  user = signal<User | null>(this.loadUser());
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
  hasAnyRole = (roles: readonly string[]) => roles.includes(this.user()?.role ?? "");
  setUser(user: User | null) {
    user
      ? localStorage.setItem("asa_user", JSON.stringify(user))
      : localStorage.removeItem("asa_user");
    this.user.set(user);
  }
  setToken(t: string | null) {
    t
      ? localStorage.setItem("asa_token", t)
      : localStorage.removeItem("asa_token");
    this.token.set(t);
  }

  private loadUser(): User | null {
    const stored = localStorage.getItem("asa_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem("asa_user");
      return null;
    }
  }
}
