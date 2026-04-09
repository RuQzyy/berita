import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {

  isScrolled = false;
  activeCategory: string = '';
  isMenuOpen: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.currentCategory$.subscribe(category => {
      this.activeCategory = category;
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  selectCategory(category: string) {
    this.categoryService.setCategory(category);
    this.activeCategory = category;

    this.router.navigate(['/']);
    this.isMenuOpen = false; 

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
