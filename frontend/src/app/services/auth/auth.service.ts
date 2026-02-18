import { Injectable, signal, computed } from '@angular/core';
import { from, Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { authClient } from '../../lib/auth-client';

type AuthUser = {
  createdAt: Date;
  email: string;
  emailVerified: boolean;
  id: string;
  image?: string | null;
  name: string;
  updatedAt: Date;
};

type AuthError = {
  code?: string;
  message?: string;
};

type AuthSession = {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  ipAddress?: string | null;
  token: string;
  updatedAt: Date;
  userAgent?: string | null;
  userId: string;
};

type SignInData = {
  redirect: boolean;
  token: string;
  url?: string;
  user: AuthUser;
};

type SignUpData = {
  token: string | null;
  user: AuthUser;
};

type SessionData = {
  session: AuthSession | null;
  user: AuthUser | null;
};

type SignInResponse = { data: SignInData | null; error: AuthError | null };
type SignUpResponse = { data: SignUpData | null; error: AuthError | null };
type SessionResponse = { data: SessionData | null; error: AuthError | null };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionSig = signal<SessionResponse | null>(null);

  readonly session = computed(() => this.sessionSig());
  readonly user = computed(() => this.sessionSig()?.data?.user ?? null);
  readonly isAuthenticated = computed(() => !!this.user());

  signIn(email: string, password: string): Observable<SignInResponse> {
    return from(authClient.signIn.email({ email, password })).pipe(
      switchMap((result) => this.getSession().pipe(map(() => result))),
    );
  }

  signUp(name: string, email: string, password: string): Observable<SignUpResponse> {
    return from(authClient.signUp.email({ email, name, password }));
  }

  signOut(): Observable<unknown> {
    return from(authClient.signOut()).pipe(tap(() => this.sessionSig.set(null)));
  }

  getSession(): Observable<SessionResponse> {
    return from(authClient.getSession()).pipe(tap((res) => this.sessionSig.set(res)));
  }
}
