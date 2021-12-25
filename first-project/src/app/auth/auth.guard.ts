import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


// The AuthGuard is used by app-routing.module.ts and protects hidden content when user
// is not logged in.
// https://angular.io/guide/router#milestone-5-route-guards

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            // is route is blocked, direct user to login
            this.router.navigate(['/auth/login']);
        }
        return true;
    }
}