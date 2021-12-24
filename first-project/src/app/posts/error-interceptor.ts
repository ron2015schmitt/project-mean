import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// ErrorInterceptor inspects HTTP requests to/from your application to the server
// It is entered as a provider in app.module.ts.
// https://angular.io/guide/http#intercepting-requests-and-responses

export class ErrorInterceptor implements HttpInterceptor{


    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // insert our authToken on the HTTP request so that it gets passed to the backend
        return next.handle(req).pipe(
            catchError( (error: HttpErrorResponse) => {
                console.log(error);
                alert(error.error.error.message);
                return throwError(error);
            })
        );
    }
}