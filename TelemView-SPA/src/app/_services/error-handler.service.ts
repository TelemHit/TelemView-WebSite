//service that catches errors from server

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  [x: string]: any;

  constructor(private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(errorMessage);
      })
    )
  }

  //check error status code
  private handleError = (error: HttpErrorResponse) : string => {
    if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 401){
      return this.handleUnAuthorizedRequest(error);
    }
  }

  //error 404
  private handleNotFound = (error: HttpErrorResponse): string => {
    // this._router.navigate(['/404']);
    return error.message;
  }

  //error 400
  private handleBadRequest = (error: HttpErrorResponse): string => {
    if(this._router.url === '/editor/admin' || this._router.url.startsWith('/resetpassword')){
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m: string) => {
        if(m=="Invalid Request" || m=="Invalid token."){
          m = "תוקף העמוד פג"
        }
         message += m + '<br>';
      })
      return message.slice(0, -4);
    }
    else{
      return error.error ? error.error : error.message;
    }
  }

  //error 401
  private handleUnAuthorizedRequest = (error: HttpErrorResponse): string => {
    if(this._router.url === '/editor'){
      const message = error.error.errorMessage;
      return message;
    }
    else{
      return error.error ? error.error : error.message;
    }
  }

}
