import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// 🔥 TYPE (ANTI ANY)
export interface NewsItem {
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  image?: {
    large?: string;
    small?: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private newsCache: NewsItem[] = [];

  constructor(private http: HttpClient) {}

  // 🔥 API CALL
  getLatestNews(): Observable<any> {
    return this.http.get('/api/cnn-news');
  }

  // 🔥 SET CACHE
  setNews(data: NewsItem[]): void {
    this.newsCache = data || [];
  }

  // 🔥 GET CACHE
  getNewsCache(): NewsItem[] {
    return this.newsCache;
  }

  // 🔥 SLUG GENERATOR
  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // 🔥 AMBIL ID DARI LINK CNN
  getIdFromLink(link: string): string {
    if (!link) return '';

    const match = link.match(/-(\d+)(\/|$)/);
    return match ? match[1] : '';
  }

  // 🔥 FIND BY SLUG (ANTI BUG TOTAL)
  findBySlug(slug: string): NewsItem | null {

    if (!slug || this.newsCache.length === 0) return null;

    // ✅ 1. EXACT MATCH
    const exact = this.newsCache.find((item: NewsItem) =>
      this.slugify(item.title) === slug
    );

    if (exact) return exact;

    // ✅ 2. FLEXIBLE MATCH
    const flexible = this.newsCache.find((item: NewsItem) => {
      const itemSlug = this.slugify(item.title);
      return itemSlug.includes(slug) || slug.includes(itemSlug);
    });

    if (flexible) return flexible;

    // ✅ 3. MATCH BY ID (SUPER AMAN)
    const foundById = this.newsCache.find((item: NewsItem) => {
      const id = this.getIdFromLink(item.link);
      return slug.includes(id);
    });

    if (foundById) return foundById;

    return null;
  }

  // 🔥 FIND BY ID (LEVEL PRO)
  findById(id: string): NewsItem | null {
    if (!id) return null;

    return this.newsCache.find((item: NewsItem) =>
      this.getIdFromLink(item.link) === id
    ) || null;
  }

}
