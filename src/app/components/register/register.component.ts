import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm: FormGroup;
  profileImageFile: File | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // Inject AuthService
    private snackBar: MatSnackBar,
    private router: Router
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
    const formDataRaw = this.registrationForm.value;

    // ✅ Format date before appending
    formDataRaw.dob = this.formatDate(formDataRaw.dob);

    // ✅ Convert to FormData for file upload
    const formData = new FormData();
    for (const key in formDataRaw) {
      if (formDataRaw.hasOwnProperty(key)) {
        formData.append(key, formDataRaw[key]);
      }
    }

    // ✅ Append profile photo if selected
    if (this.profileImageFile) {
      formData.append('profile_photo', this.profileImageFile);
    }

    // ✅ Send request using AuthService
    this.authService.register(formData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
          panelClass: 'snack-success',
        });

        this.registrationForm.reset();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        this.snackBar.open('Registration failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'snack-error',
        });
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