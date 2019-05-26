import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UnitedR';
  constructor(
    public util:UtilService,
    public auth:AuthService
    ){

  }
}
