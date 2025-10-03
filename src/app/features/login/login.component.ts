import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({username: ['', [Validators.required]], password: ['', [Validators.required]]});
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/products']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    const { username, password } = this.loginForm?.value;

    this.authService.login(username, password)
      .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (error) => console.error('Login failed:', error)
      });
  }
}
