import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService';
import { UserInterface } from '../../interfaces/userInterface';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SwitchTheme } from "../../components/switch-theme/switch-theme";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
    SwitchTheme,
    ToastModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos inválidos',
        detail: 'Preencha corretamente o e-mail e a senha.',
        life: 3000
      });
      return;
    }

    const payload: UserInterface = {
      login: this.loginForm.value.login,
      password: this.loginForm.value.password
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        console.log('Usuário logado com sucesso:', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['']);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário logado com sucesso!',
          life: 3000
        });
      },
      error: (err) => {
        console.error('Erro ao logar usuário:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Usuário ou senha inválido!',
          life: 3000
        });
      }
    });
  }
}
