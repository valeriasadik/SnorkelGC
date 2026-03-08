import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslationService } from 'src/app/core/services/translation.service';
import { LangToggleComponent } from 'src/app/shared/components/lang-toggle/lang-toggle.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [IonContent, LangToggleComponent],
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {
  ts = inject(TranslationService);
  private router = inject(Router);

  enter(): void {
    this.router.navigate(['/discover']);
  }
}