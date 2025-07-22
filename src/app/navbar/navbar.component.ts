import { Component,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule
  ]
})
export class NavbarComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  //  Automatically close sidenav if clicked outside on mobile
  @HostListener('document:click', ['$event'])
  closeSidebarOnOutsideClick(event: Event) {
    const clickedElement = event.target as HTMLElement;

    const clickedInsideSidebar = clickedElement.closest('mat-sidenav');
    const clickedMenuIcon = clickedElement.closest('.menu-icon');

    // Only apply on mobile (max-width: 768px)
    const isMobile = window.innerWidth <= 768;

    if (isMobile && this.isSidebarOpen && !clickedInsideSidebar && !clickedMenuIcon) {
      this.isSidebarOpen = false;
    }
  }
}