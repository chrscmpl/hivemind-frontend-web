import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdeaDto } from '@shared/dto/idea.dto';
import { IdeaEntity } from '@shared/entities/idea.entity';
import {
  PaginatedRequestManager,
  PaginatedRequestParams,
} from '@shared/helpers/paginated-request-manager.helper';
import { defaults } from 'lodash-es';
import { environment } from 'src/environments/environment';

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
export class IdeaPaginationService {
  public constructor(private readonly http: HttpClient) {}

  public createManager(
    params: IdeaPaginationParams,
  ): PaginatedRequestManager<IdeaEntity> {
    return new PaginatedRequestManager<IdeaEntity>(
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
