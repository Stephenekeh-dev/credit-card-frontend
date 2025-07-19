import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionApprovalDialogComponent } from '../transaction-approval-dialog/transaction-approval-dialog.component'; // adjust path


@Component({
  selector: 'app-make-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './make-transaction.component.html',
  styleUrl: './make-transaction.component.css'
})
export class MakeTransactionComponent {
  transactionForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MakeTransactionComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { email: string },
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.transactionForm = this.fb.group({
      email: [{ value: data.email, disabled: true }],
      token: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  submitFakeTransaction(): void {
  if (this.transactionForm.invalid) return;

  const payload = {
    email: this.data.email,
    token: this.transactionForm.getRawValue().token,
    amount: this.transactionForm.getRawValue().amount,
    is_fraud: true
  };

  this.authService.submitFraudTransaction(payload).subscribe({
    next: (response) => {
      this.dialogRef.close();
      setTimeout(() => {
        this.openResultDialog(true, response.message, response.transaction);
      }, 300);
    },
    error: (error) => {
      this.dialogRef.close();
      const errorMessage = error?.error?.message || error?.error?.error || 'Fraud transaction failed';
      setTimeout(() => {
        this.openResultDialog(false, errorMessage);
      }, 300);
    }
  });
}
openResultDialog(success: boolean, message: string, transaction?: any): void {
  this.dialog.open(TransactionApprovalDialogComponent, {
    width: '400px',
    data: { success, message, transaction }
  });
}
close(): void {
  this.dialogRef.close({ success: false });
}

}
