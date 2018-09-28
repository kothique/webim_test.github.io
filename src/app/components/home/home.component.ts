import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VKService } from '../../services/vk.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private vk: VKService
  ) { }

  private readonly redirectUri = 'https://kothique.github.io/webim_test.github.io/callback';

  readonly authUrl =
    `https://oauth.vk.com/authorize` +
    `?client_id=${environment.vkClientId}` +
    `&display=page` +
    `&redirect_uri=${this.redirectUri}` +
    `&scope=offline` +
    `&response_type=token` +
    `&v=${environment.vkAPIVersion}` +
    `&state=123456`;

  authenticated$ = this.vk.authenticated$;
  fullName$ = this.vk.fullName$;
  friendsNames$ = this.vk.friendsNames$;

  ngOnInit() { }
}
