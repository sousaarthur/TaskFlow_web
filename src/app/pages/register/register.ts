import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService';
import { UserInterface } from '../../interfaces/userInterface';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SwitchTheme } from "../../components/switch-theme/switch-theme";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    ToastModule,
    SwitchTheme
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: 'Verifique os campos do formulário antes de continuar.',
        life: 3000
      });
      return;
    }

    const payload: UserInterface = {
      login: this.registerForm.value.login,
      password: this.registerForm.value.password
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        console.log('Usuário cadastrado com sucesso:', res);
        this.router.navigate(['/login']);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário registrado com sucesso!',
          life: 3000
        });
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Já existe um usuário com esse e-mail!',
          life: 3000
        });
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }
}
