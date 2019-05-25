import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public isloading=false;
  constructor(
    private snackBar:MatSnackBar
  ) { }

  openSnackBar(msg:string,duration:number=5000,actionbutton:string='Close',callback:Function=null){
    let snackBarRef = this.snackBar.open(msg,actionbutton,{
      duration:duration,
      panelClass:'mysnackbar'
    });
    snackBarRef.onAction().subscribe(() => {
      if(callback!=null){
        callback();
      }
    });
  }
  showloading(){
    this.isloading=true;
  }
  hideloading(){
    this.isloading=false;
  }
}
