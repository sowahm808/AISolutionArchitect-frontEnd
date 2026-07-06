import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AppStore } from "../core/app.store";
import { AuthService } from "../services/api.service";
import { MATERIAL_IMPORTS } from "../material.imports";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  template: `
    <section class="profile-page">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            {{ initials }}
          </div>
          <mat-card-title>{{ store.user()?.name || "Architecture User" }}</mat-card-title>
          <mat-card-subtitle>{{ store.user()?.email || "No email loaded" }}</mat-card-subtitle>
        </mat-card-header>
        <mat-divider />
        <mat-card-content class="profile-details">
          <div>
            <span>Role</span>
            <strong>{{ store.user()?.role || "Viewer" }}</strong>
          </div>
          <div>
            <span>Organization ID</span>
            <strong>{{ store.user()?.organizationId || "Not assigned" }}</strong>
          </div>
          <div>
            <span>User ID</span>
            <strong>{{ store.user()?.id || "Not available" }}</strong>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-stroked-button color="primary" type="button" (click)="logout()">
            <mat-icon aria-hidden="true">logout</mat-icon>
            Logout
          </button>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: [`
    .profile-page { max-width: 760px; margin: 0 auto; }
    .profile-card { overflow: hidden; }
    .profile-avatar { display: grid; place-items: center; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); font-weight: 700; }
    .profile-details { display: grid; gap: 16px; padding-top: 24px; }
    .profile-details div { display: flex; justify-content: space-between; gap: 24px; padding: 14px 0; border-bottom: 1px solid var(--mat-sys-outline-variant); }
    .profile-details span { opacity: 0.72; }
  `],
})
export class ProfileComponent {
  protected readonly store = inject(AppStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected get initials() {
    return (this.store.user()?.name ?? "AU")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  protected logout() {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
