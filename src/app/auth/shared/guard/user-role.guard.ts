import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})

export class UserRoleGuard implements CanActivate{

  constructor(
    private __authService: AuthService,
    private __router: Router) { }
    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    let cognitoUser :any = null;
  try {
    
    let role = localStorage.getItem("role");
    
    if(role ==null){
      cognitoUser = this.__authService.decode();
    }

    if (( cognitoUser != null && cognitoUser["custom:role"] === route.data.role) || (role == route.data.role )) {
      return true;
    }
  } catch(error) {
    console.log(error)
  }
    this.__router.navigate(['/authentication/auth/login']);
    return false;
    
    // throw new Error("Method not implemented.");
  }
  
}
