import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheKeysEnum } from '@app/core/cache/enum/cache-keys.enum';
import { cacheConfigs } from '@app/core/cache/helpers/cache-configs.helper';
import { CacheService } from '@app/core/cache/services/cache.service';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { IdeaDto } from '@shared/dto/idea.dto';
import { IdeaEntity } from '@shared/entities/idea.entity';
import {
  PaginatedRequestManager,
  PaginatedRequestParams,
} from '@shared/helpers/paginated-request-manager.helper';
import { defaults } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { IdeaPaginationMetaDto } from '../dto/idea-pagination-meta.dto';
import { IdeaPaginationMetaEntity } from '../entities/idea-pagination-meta.entity';

export interface IdeaPaginationQuery {
  sort?: string;
  age?: string;
  includeOwnVotes?: boolean;
  includeUsers?: boolean;
}

export type IdeaPaginationParams = Omit<
  PaginatedRequestParams<IdeaEntity>,
  'deserializer' | 'http' | 'url' | 'query'
> & { query: IdeaPaginationQuery };

@Injectable({
  providedIn: 'root',
})
export class IdeaFetchService {
  public constructor(
    private readonly http: HttpClient,
    private readonly cacheService: CacheService,
  ) {}

  @Cacheable(cacheConfigs[CacheKeysEnum.IDEA])
  public fetch(id: number): Observable<IdeaEntity> {
    return this.http
      .get<IdeaDto>(`${environment.api}/posts/${id}`, {
        params: {
          include: 'user,myVote',
        },
      })
      .pipe(map((data: IdeaDto) => new IdeaEntity(data)));
  }

  @Cacheable(cacheConfigs[CacheKeysEnum.IDEA_PAGINATION])
  public paginate(
    params: IdeaPaginationParams,
  ): Observable<PaginatedRequestManager<IdeaEntity, IdeaPaginationMetaEntity>> {
    if (params.query.sort === IdeaSortEnum.NEW) {
      delete params.query.age;
    }

    const manager = new PaginatedRequestManager<
      IdeaEntity,
      IdeaPaginationMetaEntity
    >(
      defaults(
        {
          query: this.buildQuery(params.query),
        },
        {
          http: this.http,
          url: `${environment.api}/posts`,
          deserializer: this.deserialize.bind(this),
          ...params,
        },
      ),
    );

    return manager.next().pipe(map(() => manager));
  }

  public cache(idea: IdeaEntity): void {
    if (environment.cacheStrategy !== 'aggressive' || !idea.isComplete) {
      return;
    }
    this.cacheService.manualAdd({
      key: CacheKeysEnum.IDEA,
      value: idea,
      parameters: [idea.id],
    });
  }

  private deserialize(
    data: { items: IdeaDto[]; meta: IdeaPaginationMetaDto },
    manager: PaginatedRequestManager<IdeaEntity, IdeaPaginationMetaEntity>,
  ) {
    if (data.meta) {
      manager.meta = data.meta;
    }
    return data.items.map((item) => new IdeaEntity(item));
  }

  private buildQuery(
    query: IdeaPaginationQuery,
  ): Record<string, string | number | boolean | undefined> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (query.sort) {
      params['sort'] = query.sort;
    }

    if (query.age) {
      params['age'] = query.age;
    }

    const include = this.buildIncludeParameter(query);

    if (include) {
      params['include'] = include;
    }

    return params;
  }

  private buildIncludeParameter(query: IdeaPaginationQuery): string {
    const include = [];
    if (query.includeOwnVotes === true) {
      include.push('myVote');
    }
    if (query.includeUsers === true) {
      include.push('user');
    }
    return include.join(',');
  }
}
