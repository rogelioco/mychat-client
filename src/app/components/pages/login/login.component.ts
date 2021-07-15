import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/shared/interfaces/data.interface';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authData$ = this.data.authData$;
  alertObs$ = this.data.alert$;
  user$ = this.data.user$;
  alert = false;
  err: String;
  userName: String = '';
  password: String = '';

  succes = false;
  name: String;


  constructor(private data: DataService) {
    this.user$.subscribe( res => {
      if(res != null) {
        this.succes = true;
        this.name = res.userName
      }else{
        this.succes = false;
      }
    })
  }

  ngOnInit(): void {
    this.data.resetAlert();
    this.alertObs$.subscribe(
      res => {
        this.err = res.message;
        this.alert = res.status;
      }
    )
  }

  login() {
    this.data.login(this.userName, this.password);
  }

  ngOnDestroy() {
    this.succes = false;
  }
}
