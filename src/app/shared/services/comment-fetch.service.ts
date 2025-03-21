import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheKeysEnum } from '@app/core/cache/enum/cache-keys.enum';
import { cacheConfigs } from '@app/core/cache/helpers/cache-configs.helper';
import { Cacheable } from 'ts-cacheable';
import {
  PaginatedRequestManager,
  PaginatedRequestParams,
} from '../helpers/paginated-request-manager.helper';
import { CommentEntity } from '../entities/comment.entity';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDto } from '../dto/comment.dto';
import { CommentPaginationMetaDto } from '../dto/comment-pagination-meta.dto';
import { CommentPaginationMetaEntity } from '../entities/comment-pagination-meta.entity';
import { defaults } from 'lodash-es';
import { AuthService } from '@app/core/auth/services/auth.service';

export type CommentPaginationParams = Omit<
  PaginatedRequestParams<CommentEntity>,
  'deserializer' | 'http' | 'url' | 'query'
> & { ideaId: number; includeUser?: boolean };

@Injectable({
  providedIn: 'root',
})
export class CommentFetchService {
  public constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  @Cacheable(cacheConfigs[CacheKeysEnum.COMMENT_PAGINATION])
  public paginate(
    params: CommentPaginationParams,
  ): Observable<
    PaginatedRequestManager<CommentEntity, CommentPaginationMetaEntity>
  > {
    const manager = new PaginatedRequestManager<
      CommentEntity,
      CommentPaginationMetaEntity
    >(
      defaults(
        params.includeUser
          ? {
              query: {
                include: 'user',
              },
            }
          : {},
        {
          http: this.http,
          url: `${environment.api}/posts/${params.ideaId}/comments`,
          deserializer: this.deserialize.bind(this),
          ...params,
        },
      ),
    );

    return this.auth.authChecked$.pipe(
      switchMap(() => manager.next()),
      map(() => manager),
    );
  }

  private deserialize(
    data: { items: CommentDto[]; meta?: CommentPaginationMetaDto },
    manager: PaginatedRequestManager<
      CommentEntity,
      CommentPaginationMetaEntity
    >,
  ) {
    if (data.meta) {
      manager.meta = data.meta;
    }
    return data.items.map((item) => new CommentEntity(item));
  }
}
