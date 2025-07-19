import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { TransactionApprovalDialogComponent } from '../transaction-approval-dialog/transaction-approval-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-approval',
  templateUrl: './transaction-approval.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    // any other needed modules
  ],
  styleUrls: ['./transaction-approval.component.css']
})
export class TransactionApprovalComponent {
  approvalForm: FormGroup;
  loading = false;
  submitting = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TransactionApprovalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { token?: string }
  ) {
    this.approvalForm = this.fb.group({
      token: [{ value: data?.token || '', disabled: true }, Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

 submitApproval(): void {
  if (this.approvalForm.invalid) return;

  this.submitting = true;
  const { token, amount } = this.approvalForm.getRawValue();

  this.authService.approveTransaction({ token, amount }).subscribe({
    next: (response) => {
      this.submitting = false;
      this.dialogRef.close();
      setTimeout(() => {
        this.openResultDialog(true, response.message, response.transaction);
      }, 300);
    },
    error: (error) => {
      this.submitting = false;
      this.dialogRef.close();
      const errorMessage = error?.error?.message || error?.error?.error || 'Transaction failed';
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
    this.dialogRef.close(); 
  }
}
