import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading: boolean = false; // ✅ Add this line

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true; // ✅ Start spinner
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (res) => {
          const access = res.access;
          const refresh = res.refresh;

          if (access && refresh) {
            this.authService.storeTokens(access, refresh);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Invalid login response: tokens missing.';
          }
          this.loading = false; // ✅ Stop spinner
        },
        error: (err) => {
          this.errorMessage = err.error?.detail || 'Login failed. Please try again.';
          this.loading = false; // ✅ Stop spinner
        }
      });
    }
  }
}
