import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-approval-dialog',
  standalone: true,
  templateUrl: './transaction-approval-dialog.component.html',
  styleUrl: './transaction-approval-dialog.component.css',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class TransactionApprovalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { success: boolean, message: string, transaction?: any }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
