import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  template: `
    <h1 mat-dialog-title>Logging in ...</h1>
    <mat-dialog-content style="overflow: hidden">
      <img
        src="/assets/images/waiting.svg"
        alt="Waiting illustration"
        style="width: 100%;"
      />
    </mat-dialog-content>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialogComponent {}
