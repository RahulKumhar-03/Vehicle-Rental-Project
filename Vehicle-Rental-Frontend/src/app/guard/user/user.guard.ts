import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if(authService.isAuthenticated()){
    return true;
  }
  else {
    router.navigate(['/home']);
    return false;
  }
}