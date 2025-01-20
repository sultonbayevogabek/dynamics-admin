import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatRipple,
    NgOptimizedImage,
    MatIcon
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _destroyRef = inject(DestroyRef);
  private _authService = inject(AuthService);

  ngOnInit(): void {

  }
}
