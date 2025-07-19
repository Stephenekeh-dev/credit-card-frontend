import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent} from './header/header.component';
import {NavbarComponent} from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: 
  [
    HeaderComponent,
    NavbarComponent,
    MainComponent
   ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Call the CSRF token API when the component is initialized
   
  }
}