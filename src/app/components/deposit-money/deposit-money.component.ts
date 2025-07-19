import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TokenResultDialogComponent } from '../token-result-dialog/token-result-dialog.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-deposit-money',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './deposit-money.component.html',
  styleUrl: './deposit-money.component.css',
})
export class DepositMoneyComponent {
  depositForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<DepositMoneyComponent>,
    private dialog: MatDialog,
    private authService: AuthService  // 👈 Inject AuthService
  ) {
    this.depositForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });
  }
  
  onSubmit() {
    if (this.depositForm.invalid) return;
  
    this.isLoading = true;
    const depositData = this.depositForm.value;
  
    const headers = this.authService.getAuthHeaders();  // 👈 Get headers with JWT
  
    this.http.post('https://secured-card-transact-system.onrender.com/api/deposit/', depositData, { headers }).subscribe({
      next: (response: any) => {
        console.log('✅ Deposit success response:', response);
    
        this.isLoading = false;
        this.dialogRef.close({ success: true });
    
        this.dialog.open(TokenResultDialogComponent, {
          data: {
            title: 'Deposit Successful',
            message: `Deposit was successful. New balance: ${response.new_balance}`,
            status: 'success',
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Deposit error response:', error);
    
        this.isLoading = false;
        this.dialogRef.close({ success: false });
    
        this.dialog.open(TokenResultDialogComponent, {
          data: {
            title: 'Deposit Failed',
            message: error.error?.amount?.[0] || error.message || 'An error occurred during deposit.',
            status: 'error',
          }
        });
      }
    });
    
  }
}  