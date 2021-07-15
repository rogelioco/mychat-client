import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private cookieService: CookieService, private router: Router, private data: DataService) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.cookieService.check('token') && this.cookieService.check('user');
  }

  onLogOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
