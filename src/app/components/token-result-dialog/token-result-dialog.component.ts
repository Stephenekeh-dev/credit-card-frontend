import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';           
import { VerifyTokenDialogComponent } from '../verify-token-dialog/verify-token-dialog.component';

@Component({
  selector: 'app-token-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule      
  ],
  templateUrl: './token-result-dialog.component.html',
  styleUrls: ['./token-result-dialog.component.css']
})
export class TokenResultDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      token?: string;
      error?: string;
      title?: string;
      message?: string;
      status?: 'success' | 'error';
    },
    private dialogRef: MatDialogRef<TokenResultDialogComponent>,
    private dialog: MatDialog
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  proceedToVerify(): void {
    this.dialogRef.close();
    this.dialog.open(VerifyTokenDialogComponent, {
      width: '400px',
      data: { token: this.data.token }
    });
  }
}
