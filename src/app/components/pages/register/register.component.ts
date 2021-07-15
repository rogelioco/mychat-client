import { Component, OnInit } from '@angular/core';
import { subscribe } from 'graphql';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  
  alertObs$ = this.data.alert$;
  alert = false;
  err: String;
  userName: String;
  password: String;

  
  

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.resetAlert();
    this.alertObs$.subscribe(
      res => {
        this.err = res.message;
        this.alert = res.status
      }
    )
  }

  register() {
    this.data.register(this.userName, this.password);
  }  
}
