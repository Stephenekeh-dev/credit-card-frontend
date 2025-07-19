import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenResultDialogComponent } from '../token-result-dialog/token-result-dialog.component';
import { AuthService } from '../../auth.service'; // 👈 Add this

@Component({
  selector: 'app-generate-token',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './generate-token.component.html',
  styleUrl: './generate-token.component.css'
})
export class GenerateTokenComponent {
  tokenForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<GenerateTokenComponent>,
    private dialog: MatDialog,
    private authService: AuthService  // 👈 Inject AuthService
  ) {
    this.tokenForm = this.fb.group({
      card_number: ['', [Validators.required, Validators.minLength(12)]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      expiry_date: ['', Validators.required],
      card_type: ['', Validators.required],
      account_number: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.tokenForm.invalid) return;

    this.isSubmitting = true;

    const headers: HttpHeaders = this.authService.getAuthHeaders(); // 👈 Add token to headers

    this.http.post<any>('https://secured-card-transact-system.onrender.com/api/generate-token/', this.tokenForm.value, { headers }).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.dialog.open(TokenResultDialogComponent, {
          data: {
            status: 'success', // ✅ correct key
            message: res.message,
            token: res.token_id
          },
          width: '400px',
          disableClose: true
        });
      },
      error: (err) => {
        this.dialogRef.close();
        this.dialog.open(TokenResultDialogComponent, {
          data: {
            status: 'error', // ✅ correct key
            message: err.error?.detail || 'Token generation failed.'
          },
          width: '400px',
          disableClose: true
        });
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
    
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
