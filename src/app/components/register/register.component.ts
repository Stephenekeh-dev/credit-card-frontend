import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmailValidationService } from '../../email-validation.service'; 

import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service';  // Import AuthService
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
     MatProgressSpinnerModule 
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm: FormGroup;
  profileImageFile: File | null = null;
  loading: boolean = false;

  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Inject AuthService
    private snackBar: MatSnackBar,
    private router: Router,
    private emailValidationService: EmailValidationService
  ) {
    this.registrationForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{10,}')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      card_number: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
      cvv: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
      expiry_date: ['', Validators.required],
      card_type: ['', Validators.required],
      account_no: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
       profile_photo: [null], 
    });
  }

 onSubmit() {
  if (this.registrationForm.valid) {
    const email = this.registrationForm.get('email')?.value;

    this.loading = true;

    //  Step 1: Verify the email using AbstractAPI
    this.emailValidationService.validateEmail(email).subscribe(
      (result) => {
        console.log('AbstractAPI email validation result:', result);
        const isDeliverable = result?.deliverability?.toUpperCase() === 'DELIVERABLE';
        const isDisposable = result?.is_disposable_email?.value === true;
        if (!isDeliverable || isDisposable) {
          this.snackBar.open('Please enter a valid email adress', 'Close', {
            duration: 6000,
            panelClass: 'snack-warn',
          });
          this.loading = false;
          return;
        }

        // ✅ Step 2: Proceed with registration if email is valid
        const formDataRaw = this.registrationForm.value;
        formDataRaw.dob = this.formatDate(formDataRaw.dob);

        const formData = new FormData();
        for (const key in formDataRaw) {
          if (formDataRaw.hasOwnProperty(key)) {
            formData.append(key, formDataRaw[key]);
          }
        }

        if (this.profileImageFile) {
          formData.append('profile_photo', this.profileImageFile);
        }

        this.authService.register(formData).subscribe(
          (response) => {
            this.snackBar.open('Registration successful!', 'Close', {
              duration: 3000,
              panelClass: 'snack-success',
            });
            this.registrationForm.reset();
            this.router.navigate(['/login']);
            this.loading = false;
          },
          (error) => {
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 3000,
              panelClass: 'snack-error',
            });
            this.loading = false;
          }
        );
      },
      (error) => {
        this.snackBar.open('Failed to validate email. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'snack-error',
        });
        this.loading = false;
      }
    );
  } else {
    this.snackBar.open('Please fill all required fields correctly', 'Close', {
      duration: 3000,
      panelClass: 'snack-warn',
    });
  }
}

onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.profileImageFile = event.target.files[0];
  }
}

  
  // Function to format date in "YYYY-MM-DD" format
  formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    }
    return date; // Return as is if already in string format
  }
}