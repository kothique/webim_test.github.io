import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse } from '../../models/auth-response';
import { VKService } from '../../services/vk.service';
import { parseQueryParams } from '../../util';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(
    route: ActivatedRoute,
    router: Router,
    private vk: VKService
  ) {
    if (!route.snapshot.fragment) {
      router.navigate(['/']);
    }

    const response = parseQueryParams(route.snapshot.fragment) as AuthResponse;

    if (vk.handleAuthenticationResponse(response)) {
      router.navigate(['/']);
    }
  }

  error$ = this.vk.error$;

  ngOnInit() { }
}
