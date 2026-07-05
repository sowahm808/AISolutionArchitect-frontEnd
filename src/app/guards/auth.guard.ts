import { inject } from '@angular/core'; import { CanActivateFn, Router } from '@angular/router'; import { AppStore } from '../core/app.store';
export const authGuard:CanActivateFn=()=>inject(AppStore).isAuthenticated()||inject(Router).createUrlTree(['/login']);
export const roleGuard=(roles:string[]):CanActivateFn=>()=>inject(AppStore).hasRole(roles)||inject(Router).createUrlTree(['/dashboard'],{queryParams:{forbidden:true}});
