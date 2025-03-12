import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from '@app/core/cache/services/cache.service';
import { map, Observable, tap } from 'rxjs';
import { CommentEntity } from '../entities/comment.entity';
import { CommentDto } from '../dto/comment.dto';
import { environment } from 'src/environments/environment';
import { CommentCreationData } from '../entities/comment-creation-data.entity';
import { CommentDeletionData } from '../entities/comment-deletion-data.entity';
import { CommentUpdateData } from '../entities/comment-update-data.entity';

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
        tap(() => this.cache.cacheEvents.CommentCreated$.next()),
        map((data) => new CommentEntity(data)),
      );
  }

  public update(data: CommentUpdateData): Observable<CommentEntity> {
    return this.http
      .patch<CommentDto>(
        `${environment.api}/posts/${data.ideaId}/comments/${data.old.id}`,
        {
          content: data.newContent ?? undefined,
        },
      )
      .pipe(
        tap(() => this.cache.cacheEvents.CommentUpdated$.next()),
        map((data) => new CommentEntity(data)),
      );
  }

  public delete(data: CommentDeletionData): Observable<CommentEntity> {
    return this.http
      .delete<CommentDto>(
        `${environment.api}/posts/${data.ideaId}/comments/${data.commentId}`,
      )
      .pipe(
        tap(() => this.cache.cacheEvents.CommentDeleted$.next()),
        map((data) => new CommentEntity(data)),
      );
  }
}
