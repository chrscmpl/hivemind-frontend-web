import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdeaCreationData } from '../entities/idea-creation-data.entity';
import { IdeaUpdateData } from '../entities/idea-update-data.entity';
import { tap } from 'rxjs';
import { cacheBusters } from '@app/core/misc/helpers/cache-busters.helper';

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

  public update(data: IdeaUpdateData) {
    return this.http
      .patch(`${environment.api}/posts/${data.id}`, {
        title: data.title,
        content: data.content,
      })
      .pipe(tap(() => cacheBusters.IdeaUpdated$.next()));
  }
}
