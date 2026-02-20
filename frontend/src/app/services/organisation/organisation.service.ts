import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Organisation = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
};

type OrganisationsResponse = {
  organisations: Organisation[];
};

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  getUserOrganisations(userId: string): Observable<Organisation[]> {
    return this.http
      .get<OrganisationsResponse>(`${this.apiUrl}/users/${userId}/organisations`)
      .pipe(map((response) => response.organisations));
  }

  createOrganisation(userId: string, name: string): Observable<Organisation> {
    return this.http.post<Organisation>(`${this.apiUrl}/organisations`, {
      userId,
      name,
    });
  }
}
