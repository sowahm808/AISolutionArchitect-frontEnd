import { Routes } from "@angular/router";
import { authGuard, roleGuard } from "./guards/auth.guard";
import { AppShellComponent } from "./layout/shell.component";
import { LoginComponent, RegisterComponent } from "./pages/auth.pages";
import { ProfileComponent } from "./pages/profile.page";
import {
  ArchitectureModelComponent,
  ArtifactsComponent,
  CostComponent,
  CreateProjectComponent,
  DashboardComponent,
  DiscoveryComponent,
  PresentationComponent,
  ProjectListComponent,
  ProjectOverviewComponent,
  RisksComponent,
  SecurityComponent,
  SimplePageComponent,
} from "./pages/main.pages";
export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "",
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "projects", component: ProjectListComponent },
      { path: "projects/new", component: CreateProjectComponent },
      { path: "projects/:projectId", component: ProjectOverviewComponent },
      { path: "projects/:projectId/discovery", component: DiscoveryComponent, canActivate: [roleGuard(["Admin", "Architect"])] },
      {
        path: "projects/:projectId/architecture-model",
        component: ArchitectureModelComponent,
        canActivate: [roleGuard(["Admin", "Architect"])],
      },
      { path: "projects/:projectId/artifacts", component: ArtifactsComponent, data: { artifactPage: "artifacts" } },
      { path: "projects/:projectId/diagrams", component: ArtifactsComponent, data: { artifactPage: "diagrams" } },
      { path: "projects/:projectId/adrs", component: ArtifactsComponent, data: { artifactPage: "adrs" } },
      {
        path: "projects/:projectId/infrastructure",
        component: ArtifactsComponent,
        data: { artifactPage: "infrastructure" },
        canActivate: [roleGuard(["Admin", "Architect"])],
      },
      { path: "projects/:projectId/kubernetes", component: ArtifactsComponent, data: { artifactPage: "kubernetes" }, canActivate: [roleGuard(["Admin", "Architect"])] },
      { path: "projects/:projectId/cicd", component: ArtifactsComponent, data: { artifactPage: "cicd" }, canActivate: [roleGuard(["Admin", "Architect"])] },
      { path: "projects/:projectId/security", component: SecurityComponent, canActivate: [roleGuard(["Admin", "Architect", "Security"])] },
      { path: "projects/:projectId/risks", component: RisksComponent, canActivate: [roleGuard(["Admin", "Architect", "Security"])] },
      { path: "projects/:projectId/cost", component: CostComponent, canActivate: [roleGuard(["Admin", "Architect"])] },
      {
        path: "projects/:projectId/presentation",
        component: PresentationComponent,
      },
      { path: "projects/:projectId/export", component: SimplePageComponent, canActivate: [roleGuard(["Admin", "Architect"])] },
      { path: "profile", component: ProfileComponent },
      {
        path: "settings/organization",
        component: SimplePageComponent,
        canActivate: [roleGuard(["Admin", "Architect"])],
      },
      {
        path: "settings/users",
        component: SimplePageComponent,
        canActivate: [roleGuard(["Admin"])],
      },
      {
        path: "audit-logs",
        component: SimplePageComponent,
        canActivate: [roleGuard(["Admin"])],
      },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },
  { path: "**", redirectTo: "dashboard" },
];
