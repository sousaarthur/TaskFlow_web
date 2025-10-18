import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Main } from './pages/main/main';
import { AuthGuard } from './services/authGuard';

export const routes: Routes = [
  {
    path: "",
    component: Main,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: Login
  },
  {
    path: "register",
    component: Register
  },
  {
    path: "**",
    redirectTo: ''
  }
];
