import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './footer.html',
})
export class FooterComponent {

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  // 🔥 ICON
  faYoutube = faYoutube;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faSend = faPaperPlane;

  // 🔥 STATE
  email: string = '';

  // 🔥 SCROLL KE ATAS
  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // 🔥 SOCIAL MEDIA
  openLink(type: string) {
    const links: any = {
      youtube: 'https://youtube.com',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
    };

    window.open(links[type], '_blank');
  }

  // 🔥 NAVIGASI
  navigateHome() {
    this.router.navigate(['/']).then(() => {
      this.scrollTop();
    });
  }

  filter(category: string) {
    this.categoryService.setCategory(category);

    this.router.navigate(['/']).then(() => {
      this.scrollTop();
    });
  }

  // 🔥 ALERT BANTUAN
  showAlert(message: string) {
    Swal.fire({
      icon: 'info',
      title: 'Informasi',
      text: message,
      confirmButtonColor: '#3b82f6'
    });
  }

  // 🔥 SUBSCRIBE
  subscribe() {
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Masukkan email terlebih dahulu!',
      });
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);

    if (!emailValid) {
      Swal.fire({
        icon: 'error',
        title: 'Email tidak valid',
        text: 'Masukkan format email yang benar!',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Berhasil subscribe: ${this.email}`,
    });

    this.email = '';
  }

}
