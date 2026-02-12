import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { authClient } from '../../lib/auth-client';

type SignInUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
};

type SignInData = {
  redirect: boolean;
  token: string;
  url?: string;
  user: SignInUser;
};

type SignInError = {
  code?: string;
  message?: string;
};

type SignInResult = { data: SignInData | null; error: SignInError | null };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionSubject = new BehaviorSubject<unknown>(null);
  readonly session$ = this.sessionSubject.asObservable();

  signIn(email: string, password: string): Observable<SignInResult> {
    return from(authClient.signIn.email({ email, password })).pipe(
      tap(() => this.refreshSession()),
    );
  }

  signUp(name: string, email: string, password: string): Observable<unknown> {
    return from(authClient.signUp.email({ email, name, password })).pipe(
      tap(() => this.refreshSession()),
    );
  }

  signOut(): Observable<unknown> {
    return from(authClient.signOut()).pipe(tap(() => this.sessionSubject.next(null)));
  }

  getSession(): Observable<unknown> {
    return from(authClient.getSession()).pipe(tap((session) => this.sessionSubject.next(session)));
  }

  private refreshSession(): void {
    this.getSession().subscribe();
  }
}
