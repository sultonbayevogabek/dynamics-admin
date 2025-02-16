import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const snackbar = inject(MatSnackBar);

  return inject(AuthService)
    .isAuthorized()
    .pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          snackbar.open(`Sizda tizimga kirish huquqi yo'q`, 'Tushunarli', {
            duration: 3000,
          })
          router.navigate([ '/sign-in' ]);
          return of(false);
        }

        return of(true);
      })
    );
};
