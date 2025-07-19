import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../auth.service'; // ✅ Import AuthService
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-token',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './verify-token.component.html',
  styleUrl: './verify-token.component.css'
})
export class VerifyTokenComponent implements OnInit {
  verifyForm!: FormGroup;
  loading = false;
  result: string | null = null;
  error: string | null = null;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private dialogRef = inject(MatDialogRef<VerifyTokenComponent>);
  private authService = inject(AuthService); 
  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      token: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    });
  }

  verifyToken(): void {
    if (this.verifyForm.invalid) return;

    this.loading = true;
    this.result = null;
    this.error = null;

    const { token, cardNumber } = this.verifyForm.value;

    const headers = this.authService.getAuthHeaders(); 

    this.http.post<any>('https://secured-card-transact-system.onrender.com/api/verify-token/', {
      token,
      card_number: cardNumber
    }, { headers }).subscribe({
      next: (res) => {
        this.result = res.message || 'Token verified successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Verification failed.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
