import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cacheBusters } from '@app/core/misc/helpers/cache-busters.helper';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { IdeaDto } from '@shared/dto/idea.dto';
import { IdeaEntity } from '@shared/entities/idea.entity';
import {
  PaginatedRequestManager,
  PaginatedRequestParams,
} from '@shared/helpers/paginated-request-manager.helper';
import { defaults } from 'lodash-es';
import { map, merge, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';

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
  public constructor(private readonly http: HttpClient) {}

  @Cacheable({
    maxCacheCount: 32,
    cacheBusterObserver: merge(
      cacheBusters.AuthChanged$,
      cacheBusters.IdeaUpdated$,
      cacheBusters.IdeaDeleted$,
    ),
  })
  public fetch(id: number): Observable<IdeaEntity> {
    return this.http
      .get<IdeaDto>(`${environment.api}/posts/${id}`, {
        params: {
          include: 'user,myVote',
        },
      })
      .pipe(map((data: IdeaDto) => new IdeaEntity(data)));
  }

  @Cacheable({
    maxCacheCount: 8,
    cacheBusterObserver: cacheBusters.AuthChanged$,
    cacheHasher: (params: IdeaPaginationParams[]) =>
      params.map((obj) => JSON.stringify(obj.query)),
  })
  public paginate(
    params: IdeaPaginationParams,
  ): Observable<PaginatedRequestManager<IdeaEntity>> {
    if (params.query.sort === IdeaSortEnum.NEW) {
      delete params.query.age;
    }

    const manager = new PaginatedRequestManager<IdeaEntity>(
      defaults(
        {
          query: this.buildQuery(params.query),
        },
        {
          http: this.http,
          url: `${environment.api}/posts`,
          deserializer: (data: { items: IdeaDto[] }) =>
            data.items.map((item: IdeaDto) => new IdeaEntity(item)),
          ...params,
        },
      ),
    );

    return manager.next().pipe(map(() => manager));
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
