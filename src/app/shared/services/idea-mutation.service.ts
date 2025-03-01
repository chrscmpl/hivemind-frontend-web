import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdeaCreationData } from '../entities/idea-creation-data.entity';

@Injectable({
  providedIn: 'root',
})
export class IdeaMutationService {
  constructor(private readonly http: HttpClient) {}

  public create(data: IdeaCreationData) {
    return this.http.post(`${environment.api}/posts`, {
      title: data.title,
      content: data.content,
    });
  }
}
