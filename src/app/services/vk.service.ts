import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response';

const VK_ACCESS_TOKEN = 'vkAccessToken';
const VK_USER_ID = 'vkUserId';

@Injectable({
  providedIn: 'root'
})
export class VKService {
  constructor(
    private http: HttpClient,
  ) {
    if (window.localStorage.getItem(VK_ACCESS_TOKEN) !== null) {
      this.authenticate(
        window.localStorage.getItem(VK_ACCESS_TOKEN),
        window.localStorage.getItem(VK_USER_ID)
      );
    }
  }

  private readonly baseUrl = 'https://api.vk.com/method';

  private accessToken: string|null = null;
  private userId: string|null = null;

  private authenticated = new BehaviorSubject<boolean>(false);
  readonly authenticated$ = this.authenticated.asObservable();

  private error = new BehaviorSubject<string|null>(null);
  readonly error$ = this.error.asObservable();

  private fullName = new BehaviorSubject<string|null>(null);
  readonly fullName$ = this.fullName.asObservable();

  private friendsNames = new BehaviorSubject<string[]>([]);
  readonly friendsNames$ = this.friendsNames.asObservable();

  private authenticate(accessToken: string, userId: string) {
    this.accessToken = accessToken;
    this.userId = userId;
    this.authenticated.next(true);
    this.error.next(null);
    this.fetchInfo();

    window.localStorage.setItem(VK_ACCESS_TOKEN, this.accessToken);
    window.localStorage.setItem(VK_USER_ID, this.userId);
  }

  handleAuthenticationResponse(response: AuthResponse): boolean {
    if ('error' in response) {
      this.accessToken = null;
      this.authenticated.next(false);
      this.error.next(response.error_description);
      return false;
    }

    this.authenticate(response.access_token, response.user_id);
    return true;
  }

  fetchInfo() {
    this.fetchFullName();
    this.fetchSomeFriends();
  }

  fetchFullName() {
    type Response = {
      response: { first_name: string, last_name: string }[]
    };

    const params = new HttpParams({
        fromObject: {
          user_ids: this.userId,
          access_token: this.accessToken,
          v: environment.vkAPIVersion
        }
      }).toString();

    this.http.jsonp<Response>(
      `${this.baseUrl}/users.get?${params}`,
      'callback'
    ).subscribe(({ response }) => {
      const { first_name, last_name } = response[0];

      this.fullName.next(`${first_name} ${last_name}`);
    });
  }

  fetchSomeFriends() {
    type Response = {
      response: {
        items: { first_name: string, last_name: string }[]
      }
    };

    const params = new HttpParams({
        fromObject: {
          count: '5',
          fields: 'first_name, last_name',
          access_token: this.accessToken,
          v: environment.vkAPIVersion
        }
      }).toString();

    this.http.jsonp<Response>(
      `${this.baseUrl}/friends.get?${params}`,
      'callback'
    ).subscribe(({ response }) => {
      const friends = response.items;

      this.friendsNames.next(friends.map(({ first_name, last_name }) => `${first_name} ${last_name}`));
    });
  }
}
