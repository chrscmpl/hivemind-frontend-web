import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdeaDto } from '@app/shared/dto/idea.dto';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import {
  PaginatedRequestManager,
  PaginatedRequestParams,
} from '@app/shared/helpers/paginated-request-manager.helper';

export type IdeaPaginatedRequestParams = Omit<
  PaginatedRequestParams<IdeaEntity>,
  'deserializer' | 'http' | 'url'
>;

@Injectable({
  providedIn: 'root',
})
export class IdeaPaginationService {
  private requestsMap = new Map<string, PaginatedRequestManager<IdeaEntity>>();

  public constructor(private readonly http: HttpClient) {}

  public set(
    key: string,
    params: IdeaPaginatedRequestParams
  ): PaginatedRequestManager<IdeaEntity> {
    const manager = this.createRequestManager(params);
    this.requestsMap.set(key, manager);
    return manager;
  }

  public get(key: string): PaginatedRequestManager<IdeaEntity> {
    const manager = this.requestsMap.get(key);
    if (!manager) {
      throw new Error(`Request manager with key ${key} not found`);
    }
    return manager;
  }

  public has(key: string): boolean {
    return this.requestsMap.has(key);
  }

  public createRequestManager(
    params: IdeaPaginatedRequestParams
  ): PaginatedRequestManager<IdeaEntity> {
    return new PaginatedRequestManager<IdeaEntity>({
      http: this.http,
      url: `http://localhost/posts`,
      deserializer: (data) =>
        data.items.map((item: IdeaDto) => new IdeaEntity(item)),
      ...params,
    });
  }
}
