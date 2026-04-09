import { Component, AfterViewInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('berita-app');

  ngAfterViewInit(): void {
    const loader = document.getElementById('app-loading');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}
