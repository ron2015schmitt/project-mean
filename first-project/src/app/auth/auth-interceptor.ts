import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

// AuthInterceptor inspects HTTP requests to/from your application to the server
// It is entered as a provider in app.module.ts.
// https://angular.io/guide/http#intercepting-requests-and-responses

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService) {
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // insert our authToken on the HTTP request so that it gets passed to the backend
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer "+ authToken),
        });
        return next.handle(authRequest);
    }
}