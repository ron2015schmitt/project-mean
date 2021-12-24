import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from '../error/error/error.component';


// ErrorInterceptor inspects HTTP requests to/from your application to the server
// It is entered as a provider in app.module.ts.
// https://angular.io/guide/http#intercepting-requests-and-responses

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // insert our authToken on the HTTP request so that it gets passed to the backend
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error.error.error.message);
                let errorMessage = error.error.error.message ?
                    error.error.error.message :
                    "An unknown error has occurred!";
                this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
                return throwError(error);
            })
        );
    }
}