import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { UtilService } from './util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$;
  public user:User;
  constructor(
    private afauth:AngularFireAuth,
    private util:UtilService,
    private router:Router,
    private route:ActivatedRoute,
    private userService:UserService
  ) {
    this.user$=this.afauth.authState;
    this.appUser$.subscribe(u=>{
      console.log(u)
      return this.user=u;
    });
  }
  login(email,password){
    this.util.showloading()
    this.afauth.auth.signInWithEmailAndPassword(email,password).then((r)=>{
      this.util.hideloading()
      this.loginRedirection();
    }).catch((error)=> {
      // Handle Errors here.
      this.util.hideloading()
      var errorCode = error.code;
      var errorMessage = error.message;
      this.util.openSnackBar(errorMessage);
    });
  }

  loginRedirection(){
    let defaultred='/'
    this.appUser$.pipe(
      take(1)
    ).subscribe((e:any)=>{
      let redirecto=this.route.snapshot.queryParamMap.get('returnUrl') || defaultred;
      this.router.navigate([redirecto]);
    })
  }

  logout(path='/login'){
    this.afauth.auth.signOut().then(()=>{
      this.router.navigateByUrl(decodeURIComponent(path));
    }).catch(e=>{
      console.log('catched error: ',e)
    });
  }

  register(f){
    if(f.password!!=f.password2){
      this.util.openSnackBar('Passwords are not the same!');
      return false;
    }
    this.util.showloading()
    this.afauth.auth.createUserWithEmailAndPassword(f.email, f.password).catch((error)=> {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode,errorMessage);
      this.util.hideloading()
      this.util.openSnackBar(errorMessage)
    }).then((e:any)=>{
      if(!e){return}
      let newuser = new User();
      newuser.id=e.user.uid;
      this.userService.saveUser(newuser).then(()=>{
        this.util.hideloading();
        this.loginRedirection();
      });
    })
  }
  get appUser$(){
    return this.user$.pipe(
      switchMap((user:firebase.User)=>{
        return (user?this.userService.get(user.uid):of(null));
      })
    )
  }
}
