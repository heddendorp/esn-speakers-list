import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public authenticated$;
  public dev = environment.production ? 0 : 1;
  constructor(private auth: AuthService) {
    this.authenticated$ = auth.authenticated$;
  }

  showLoginDialog(): void {
    this.auth.showLoginDialog();
  }

  logout(): Promise<any> {
    return this.auth.logout();
  }
}
