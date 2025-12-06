import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <app-dashboard></app-dashboard>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Economic Data Tracker';
}
