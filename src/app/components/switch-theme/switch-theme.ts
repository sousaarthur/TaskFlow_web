import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-switch-theme',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './switch-theme.html',
  styleUrls: ['./switch-theme.css']
})
export class SwitchTheme implements OnInit {

  icon: string = 'pi pi-sun';
  actived: boolean = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.actived = true;
      this.icon = 'pi pi-moon';
      document.querySelector('html')?.classList.add('my-app-dark');
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;

    this.actived = !this.actived;

    if (this.actived) {
      this.icon = 'pi pi-moon';
      element.classList.add('my-app-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.icon = 'pi pi-sun';
      element.classList.remove('my-app-dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
