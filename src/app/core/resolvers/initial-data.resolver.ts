import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';

export const initialDataResolver: ResolveFn<Observable<UserModel>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> => {
  const authService = inject(AuthService);

  return authService.getUserByToken()
}
