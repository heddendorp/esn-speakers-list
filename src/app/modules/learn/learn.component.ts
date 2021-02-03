import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent implements OnInit {
  step$ = new BehaviorSubject(0);

  constructor() {}

  ngOnInit(): void {}

  setStep(step: number) {
    this.step$.next(step);
    setTimeout(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    );
  }
}
