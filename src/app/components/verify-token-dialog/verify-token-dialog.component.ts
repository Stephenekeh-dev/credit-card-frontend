import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth.service'; 
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TransactionApprovalComponent } from '../transaction-approval/transaction-approval.component'; // adjust path if needed


@Component({
  selector: 'app-verify-token-dialog',
  standalone: true,
  templateUrl: './verify-token-dialog.component.html',
  styleUrl: './verify-token-dialog.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    
    MatButtonModule
  ]
})
export class VerifyTokenDialogComponent {
  verifyForm: FormGroup;
  verifying = false;
  resultMessage: string | null = null;
  resultSuccess = false;

  // Variables to store decrypted card information
  cardDetails: { card_number: string; cvv: string; expiry_date: string; card_type: string; account_number: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService, // ✅ Inject AuthService
    private dialogRef: MatDialogRef<VerifyTokenDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { token?: string }
  ) {
    this.verifyForm = this.fb.group({
      token: [data.token || '', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]]
    });
  }

  submitVerification(): void {
    if (this.verifyForm.invalid) return;

    this.verifying = true;
    this.resultMessage = null;
    this.resultSuccess = false;

    const { token, cardNumber } = this.verifyForm.value;
    const headers = this.authService.getAuthHeaders(); // ✅ Auth headers

    this.http.post<any>('https://secured-card-transact-system.onrender.com/api/verify-token/', {
      token,
      card_number: cardNumber
    }, { headers }).subscribe({
      next: (res) => {
        this.resultMessage = res.message || 'Token verified successfully!';
        this.resultSuccess = true;
        this.cardDetails = {
          card_number: res.card_number,
          cvv: res.cvv,
          expiry_date: res.expiry_date,
          card_type: res.card_type,
          account_number: res.account_number
        };
        this.verifying = false;
      },
      error: (err) => {
        this.resultMessage = err.error?.detail || 'Verification failed.';
        this.resultSuccess = false;
        this.verifying = false;
      }
    });
  }
  openTransactionApproval(): void {
    const token = this.verifyForm.get('token')?.value;
    this.dialogRef.close(); // optional: close current dialog
    this.dialog.open(TransactionApprovalComponent, {
      width: '400px',
      data: { token }
    });
  }
  

  close(): void {
    this.dialogRef.close();
  }
}
