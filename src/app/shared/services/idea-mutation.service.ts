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
      .patch(`${environment.api}/posts/${data.old.id}`, {
        title: data.newTitle ?? undefined,
        content: data.newContent ?? undefined,
      })
      .pipe(tap(() => cacheBusters.IdeaUpdated$.next()));
  }

  public delete(id: number) {
    return this.http
      .delete(`${environment.api}/posts/${id}`)
      .pipe(tap(() => cacheBusters.IdeaDeleted$.next()));
  }
}
