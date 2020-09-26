import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-lists-page',
  template: `
    <p>
      lists-page works!
    </p>
  `,
  styles: [],
})
export class ListsPageComponent implements OnInit {
  constructor(private auth: AngularFireAuth) {
    auth.user.subscribe(console.log);
  }

  ngOnInit(): void {}
}
