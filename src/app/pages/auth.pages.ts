import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/api.service";
import { MATERIAL_IMPORTS } from "../material.imports";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ...MATERIAL_IMPORTS],
  templateUrl: "./auth.pages.html",
  styleUrl: "./auth.pages.css",
})
export class LoginComponent {
  mode = "login";
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  form = this.fb.nonNullable.group({
    email: ["architect@contoso.com", [Validators.required, Validators.email]],
    password: ["password", [Validators.required]],
  });
  submit() {
    this.auth.login(this.form.value.email!).subscribe(() => this.router.navigateByUrl("/dashboard"));
  }
}

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ...MATERIAL_IMPORTS],
  templateUrl: "./auth.pages.html",
  styleUrl: "./auth.pages.css",
})
export class RegisterComponent {
  mode = "register";
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    email: ["", Validators.email],
    password: ["", Validators.required],
  });
  submit() {
    this.auth.register(this.form.value.email!).subscribe(() => this.router.navigateByUrl("/dashboard"));
  }
}
