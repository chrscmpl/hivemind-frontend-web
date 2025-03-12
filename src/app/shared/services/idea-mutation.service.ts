import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdeaCreationData } from '../entities/idea-creation-data.entity';
import { IdeaUpdateData } from '../entities/idea-update-data.entity';
import { map, Observable, tap } from 'rxjs';
import { CacheService } from '@app/core/cache/services/cache.service';
import { IdeaEntity } from '../entities/idea.entity';
import { IdeaDto } from '../dto/idea.dto';

@Injectable({
  providedIn: 'root',
})
export class IdeaMutationService {
  constructor(
    private readonly http: HttpClient,
    private readonly cache: CacheService,
  ) {}

  public create(data: IdeaCreationData): Observable<IdeaEntity> {
    return this.http
      .post<IdeaDto>(`${environment.api}/posts`, {
        title: data.title,
        content: data.content,
      })
      .pipe(map((data) => new IdeaEntity(data)));
  }

  public update(data: IdeaUpdateData): Observable<IdeaEntity> {
    return this.http
      .patch<IdeaDto>(`${environment.api}/posts/${data.old.id}`, {
        title: data.newTitle ?? undefined,
        content: data.newContent ?? undefined,
      })
      .pipe(
        tap(() => this.cache.cacheEvents.IdeaUpdated$.next()),
        map((data) => new IdeaEntity(data)),
      );
  }

  public delete(id: number): Observable<IdeaEntity> {
    return this.http.delete<IdeaDto>(`${environment.api}/posts/${id}`).pipe(
      tap(() => this.cache.cacheEvents.IdeaDeleted$.next()),
      map((data) => new IdeaEntity(data)),
    );
  }
}
