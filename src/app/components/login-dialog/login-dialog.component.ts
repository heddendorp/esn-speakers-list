import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  template: `
    <h1 mat-dialog-title>Logging in ...</h1>
    <mat-dialog-content style="overflow: hidden">
      <div
        style="width: 100%; max-height: 100%"
        fxLayout="row"
        fxLayoutAlign="center center"
      >
        <img src="/assets/images/waiting.svg" alt="Waiting illustration" />
      </div>
    </mat-dialog-content>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialogComponent {}
