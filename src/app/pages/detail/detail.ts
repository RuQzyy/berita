import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService, NewsItem } from '../../services/news.service';

interface CommentItem {
  name: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detail.html',
})
export class Detail implements OnInit {

  newsDetail: NewsItem | null = null;
  relatedNews: NewsItem[] = [];

  // 🔥 komentar
  comments: CommentItem[] = [];
  newComment: string = '';

  loading = true;
  error = false;

  // 🔥 skeleton main image
  imageLoaded = false;

  // 🔥 skeleton list image (FIX BUG item.loaded)
  imageStates: { [key: string]: boolean } = {};

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

  // =========================
  // 🔥 LOAD DATA
  // =========================

  loadDetailById(id: string) {
    this.loading = true;
    this.error = false;
    this.imageLoaded = false;

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

    // 🔥 shuffle related
    this.relatedNews = [...allNews]
      .filter(item => item.link !== data.link)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // 🔥 reset image state (WAJIB biar skeleton muncul lagi)
    this.imageStates = {};

    this.loadComments();

    this.loading = false;
  }

  // =========================
  // 🔥 KOMENTAR SYSTEM
  // =========================

  loadComments() {
    if (!this.newsDetail) return;

    const key = 'comments_' + this.getId();

    try {
      const saved = localStorage.getItem(key);
      this.comments = saved ? JSON.parse(saved) : [];
    } catch {
      this.comments = [];
    }
  }

  addComment() {
    if (!this.newComment.trim()) return;

    const newData: CommentItem = {
      name: 'User',
      message: this.newComment.trim(),
      date: new Date().toLocaleString('id-ID')
    };

    this.comments.unshift(newData);
    this.newComment = '';

    this.saveComments();
  }

  saveComments() {
    const key = 'comments_' + this.getId();
    localStorage.setItem(key, JSON.stringify(this.comments));
  }

  getId(): string {
    if (!this.newsDetail?.link) return '';
    return this.newsService.getIdFromLink(this.newsDetail.link);
  }

  // =========================
  // 🔥 ROUTING
  // =========================

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

  // =========================
  // 🔥 IMAGE HANDLER
  // =========================

  onImageLoad() {
    this.imageLoaded = true;
  }

  onRelatedImageLoad(key: string) {
    this.imageStates[key] = true;
  }

  // =========================
  // 🔥 UTIL
  // =========================

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

    if (
      title.includes('amerika') ||
      title.includes('china') ||
      title.includes('eropa') ||
      title.includes('singapura') ||
      title.includes('dunia')
    ) return 'internasional';

    return 'nasional';
  }

  getImage(item: NewsItem): string {
    return item?.image?.large
        || item?.image?.small
        || 'assets/no-image.jpg';
  }

  onImageError(event: any) {
    event.target.src = 'assets/no-image.jpg';
  }

}
