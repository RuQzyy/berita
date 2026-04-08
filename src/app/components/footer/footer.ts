import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faYoutube, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './footer.html',
})
export class FooterComponent {
  faYoutube = faYoutube;
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faSend = faPaperPlane;
}
