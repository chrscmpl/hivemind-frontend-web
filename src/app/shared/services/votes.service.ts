import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VotesService {
  constructor(private readonly http: HttpClient) {}

  public setVote(ideaId: number, vote: boolean | null): Observable<void> {
    return this.http.put<void>(`${environment.api}/posts/${ideaId}/votes`, {
      vote: vote ? 'up' : vote === false ? 'down' : null,
    });
  }
}
