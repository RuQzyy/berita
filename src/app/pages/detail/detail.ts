import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewsService, NewsItem } from '../../services/news.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.html',
})
export class Detail implements OnInit {

  newsDetail: NewsItem | null = null;
  relatedNews: NewsItem[] = [];

  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        this.error = true;
        this.loading = false;
        return;
      }

      this.loadDetailById(id);
    });
  }

  loadDetailById(id: string) {

    this.loading = true;
    this.error = false;

    const cached = this.newsService.findById(id);

    if (cached) {
      this.setData(cached);
      return;
    }

    this.newsService.getLatestNews().subscribe({
      next: (res: any) => {

        const allNews = (res?.data || []).filter(
          (item: NewsItem) => item?.image?.large || item?.image?.small
        );

        this.newsService.setNews(allNews);

        const found = this.newsService.findById(id);

        if (!found) {
          this.error = true;
          this.loading = false;
          return;
        }

        this.setData(found);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  setData(data: NewsItem) {
    this.newsDetail = data;

    const allNews = this.newsService.getNewsCache();

    this.relatedNews = allNews
      .filter((item: NewsItem) => item.link !== data.link)
      .slice(0, 4);

    this.loading = false;
  }

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

  // ✅ FIX ERROR TS2345
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

  getCategory(item: NewsItem): string {
    const title = item.title?.toLowerCase() || '';

    if (title.includes('bola') || title.includes('timnas')) return 'olahraga';
    if (title.includes('politik') || title.includes('presiden')) return 'politik';
    if (title.includes('kesehatan')) return 'kesehatan';
    if (title.includes('otomotif')) return 'otomotif';
    if (title.includes('internasional')) return 'internasional';

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
