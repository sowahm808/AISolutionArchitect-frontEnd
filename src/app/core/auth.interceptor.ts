import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AppStore } from "./app.store";
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AppStore),
    router = inject(Router);
  const token = store.token();
  const auth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(auth).pipe(
    catchError((err) => {
      if (err.status === 401) {
        store.setToken(null);
        router.navigate(["/login"], { queryParams: { expired: true } });
      }
      return throwError(() => err);
    }),
  );
};
