import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private __authService: AuthService,
    private __router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    let email=localStorage.getItem("email");
    let role = localStorage.getItem("role");

    console.log("role in auth :" + role);
    if(role != null )
    {
      console.log("i am a uport user");
      return true;

    }else if ( (this.__authService.isAuthenticated())) {
      console.log("i am a cognito user");
      return true;
      }
    else {
      console.log("i am not a user");

        this.__router.navigate(['/auth/auth/login']);
        return false;
    }


    // throw new Error("Method not implemented.");
  }
  
}
