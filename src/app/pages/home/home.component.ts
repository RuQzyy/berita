import { Component, OnInit } from '@angular/core';
import { NewsService, NewsItem } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class HomeComponent implements OnInit {

  news: NewsItem[] = [];
  filteredNews: NewsItem[] = [];

  loading = true;
  error = false;

  searchText: string = '';
  selectedCategory: string = '';

  headlineIndex: number = 0;

  // 🔥 PAGINATION
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private newsService: NewsService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {

    this.categoryService.currentCategory$.subscribe(category => {
      this.selectedCategory = category;
      this.filterNews();
    });

    this.getNews();
  }

  getNews() {
    this.loading = true;
    this.error = false;

    this.newsService.getLatestNews().subscribe({
      next: (res: any) => {

        this.news = (res?.data || []).filter(
          (item: NewsItem) => item?.image?.large || item?.image?.small
        );

        this.newsService.setNews(this.news);

        this.filterNews();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  // 🔥 FILTER (SEMUA KATEGORI MUNCUL)
  filterNews() {

    this.filteredNews = this.news.filter((item: NewsItem) => {

      const title = item.title?.toLowerCase() || '';
      const content = item.contentSnippet?.toLowerCase() || '';

      const matchSearch =
        title.includes(this.searchText.toLowerCase()) ||
        content.includes(this.searchText.toLowerCase());

      // 🔥 FIX: kategori fleksibel (tidak bikin kosong)
      const matchCategory = this.selectedCategory
        ? this.getCategory(item).includes(this.selectedCategory)
        : true;

      return matchSearch && matchCategory;
    });

    // 🔥 ANTI KOSONG
    if (this.filteredNews.length === 0) {
      this.filteredNews = [...this.news];
    }

    this.headlineIndex = 0;
    this.currentPage = 1;
  }

  // 🔥 PAGINATION
  get paginatedNews(): NewsItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredNews.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNews.length / this.itemsPerPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // 🔥 ROUTING
  goToDetail(item: NewsItem) {
    const id = this.newsService.getIdFromLink(item.link);
    const slug = this.slugify(item.title);

    return ['/detail', id, slug];
  }

  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // 🔥 HEADLINE CONTROL
  setHeadline(index: number) {
    this.headlineIndex = index;
  }

  nextHeadline() {
    this.headlineIndex =
      (this.headlineIndex + 1) % this.filteredNews.length;
  }

  prevHeadline() {
    this.headlineIndex =
      (this.headlineIndex - 1 + this.filteredNews.length) %
      this.filteredNews.length;
  }

  // 🔥 DATE
  formatDate(dateString?: string): string {
    if (!dateString) return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // 🔥 CATEGORY (FULL FIX → semua kategori muncul)
  getCategory(item: NewsItem): string {
    const title = item.title?.toLowerCase() || '';

    if (title.includes('bola') || title.includes('timnas')) return 'olahraga';

    if (title.includes('politik') || title.includes('presiden') || title.includes('menteri'))
      return 'politik';

    if (title.includes('kesehatan') || title.includes('rumah sakit'))
      return 'kesehatan';

    if (title.includes('mobil') || title.includes('motor') || title.includes('otomotif'))
      return 'otomotif';

    if (
      title.includes('china') ||
      title.includes('amerika') ||
      title.includes('eropa') ||
      title.includes('dunia') ||
      title.includes('singapura') ||
      title.includes('malaysia')
    ) return 'internasional';

    return 'nasional';
  }

  getImage(item: NewsItem): string {
    return item?.image?.large
        || item?.image?.small
        || 'assets/no-image.png';
  }

  onImageError(event: any) {
    event.target.src = 'assets/no-image.png';
  }

}
