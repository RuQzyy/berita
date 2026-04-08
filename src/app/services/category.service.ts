import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categorySource = new BehaviorSubject<string>('');
  currentCategory$ = this.categorySource.asObservable();

  setCategory(category: string) {
    this.categorySource.next(category);
  }
}
