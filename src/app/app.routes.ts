import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Detail } from './pages/detail/detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
  path: 'detail/:id/:slug',
  component: Detail
}
];
