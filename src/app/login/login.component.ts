import { UtilService } from './../services/util.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  queryparam:Subscription;
  form='login'
  constructor(
    private route:ActivatedRoute,
    private auth:AuthService,
    private util:UtilService
  ) {
    this.queryparam=route.queryParams.subscribe(params => {
      this.form = params['form'] || 'login';
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.queryparam.unsubscribe()
  }
  ngSubmit(form){
    console.log(form)
  }
  switchTo(to){
    this.form=to
  }
  register(form){
    console.log(form)
    this.auth.register(form.value)
  }
  login(f){
    if(!f.valid){
      this.util.openSnackBar('Please fill the form')
      return;
    }
    this.auth.login(f.value.email,f.value.password);
  }
}
