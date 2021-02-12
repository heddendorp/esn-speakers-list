import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models';
import { first, map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { transformRole } from '../../helpers';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent implements OnInit {
  public user$: Observable<User>;
  public availableRoles$: Observable<string[]>;
  public settingsForm: FormGroup;
  constructor(private auth: AuthService, private fb: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    this.user$ = this.auth.user$;
    this.availableRoles$ = this.user$.pipe(
      map((user) => user.roles.map(transformRole))
    );
    this.settingsForm = this.fb.group({
      selectedRole: [0, Validators.required],
      hidePersonalData: [false, Validators.required],
    });
    const user = await this.user$.pipe(first()).toPromise();
    this.settingsForm.patchValue(user);
  }

  async saveSettings() {
    await this.auth.updateUser(this.settingsForm.value);
  }
}
