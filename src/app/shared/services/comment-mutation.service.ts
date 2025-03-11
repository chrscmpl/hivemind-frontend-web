import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from '@app/core/cache/services/cache.service';
import { map, Observable, tap } from 'rxjs';
import { CommentEntity } from '../entities/comment.entity';
import { CommentDto } from '../dto/comment.dto';
import { environment } from 'src/environments/environment';
import { CommentCreationData } from '../entities/comment-creation-data.entity';

@Injectable({
  providedIn: 'root',
})
export class CommentMutationService {
  constructor(
    private readonly http: HttpClient,
    private readonly cache: CacheService,
  ) {}

  public create(data: CommentCreationData): Observable<CommentEntity> {
    return this.http
      .post<CommentDto>(`${environment.api}/posts/${data.ideaId}/comments`, {
        content: data.content,
      })
      .pipe(
        tap(() => this.cache.cacheBusters.CommentCreated$.next()),
        map((data) => new CommentEntity(data)),
      );
  }

  // public update(data: IdeaUpdateData): Observable<IdeaEntity> {
  //   return this.http
  //     .patch<IdeaDto>(`${environment.api}/posts/${data.old.id}`, {
  //       title: data.newTitle ?? undefined,
  //       content: data.newContent ?? undefined,
  //     })
  //     .pipe(
  //       tap(() => this.cache.cacheBusters.IdeaUpdated$.next()),
  //       map((data) => new IdeaEntity(data)),
  //     );
  // }

  // public delete(id: number): Observable<IdeaEntity> {
  //   return this.http.delete<IdeaDto>(`${environment.api}/posts/${id}`).pipe(
  //     tap(() => this.cache.cacheBusters.IdeaDeleted$.next()),
  //     map((data) => new IdeaEntity(data)),
  //   );
  // }
}
