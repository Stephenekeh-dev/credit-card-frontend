import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { GenerateTokenComponent } from '../generate-token/generate-token.component';
import { DepositMoneyComponent } from '../deposit-money/deposit-money.component';
import { MakeTransactionComponent } from '../make-transaction/make-transaction.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userInfo: any = null;
  balance: number = 0;
  recentTransactions: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const headers = this.authService.getAuthHeaders();  // Add Authorization header with JWT
    this.http.get('https://secured-card-transact-system.onrender.com/api/dashboard/', { headers }).subscribe({
      next: (response: any) => {
        this.userInfo = response.user_info;
        this.balance = response.balance;
        this.recentTransactions = response.recent_transactions;
      },
      error: (error) => {
        console.error('Error loading dashboard data', error);
        this.router.navigate(['/login']);
      },
    });
  }

  openGenerateTokenDialog(): void {
    this.dialog.open(GenerateTokenComponent, {
      width: '500px',
      disableClose: true,
      backdropClass: 'dialog-backdrop',
    });
  }

  openDepositMoneyDialog(): void {
    const dialogRef = this.dialog.open(DepositMoneyComponent, {
      width: '400px',
      disableClose: true,
      backdropClass: 'dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.loadDashboardData(); // Refresh after deposit
      }
    });
  }
  openMakeTransactionDialog(): void {
  // You’ll need to create this component
  const dialogRef = this.dialog.open(MakeTransactionComponent, {
    width: '500px',
    disableClose: true,
    backdropClass: 'dialog-backdrop',
    data: { email: this.userInfo?.email }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result?.success) {
      this.loadDashboardData(); // Refresh after transaction
    }
  });
}


  logout(): void {
    this.authService.logout();  // Just remove token from storage
    this.router.navigate(['/login']);
  }
}
