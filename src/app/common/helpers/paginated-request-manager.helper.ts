/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, map, take } from 'rxjs';

type DeserializerFn<Entity> = (input: any) => Entity[];

interface PaginatedRequestParams<Entity> {
  http: HttpClient;
  url: string;
  deserializer?: DeserializerFn<Entity>;
  queryParameters?: Record<string, any>;
  page?: number;
  limit?: number;
  pageParamName?: string;
  limitParamName?: string;
}

export class PaginatedRequestManager<Entity> {
  private readonly http: HttpClient;
  private readonly url: string;
  private readonly deserializer?: DeserializerFn<Entity>;
  private readonly queryParameters?: Record<string, any>;
  private readonly pageParamName: string;
  private readonly limitParamName: string;

  private _page: number;
  private readonly _limit: number;

  private _data$: ReplaySubject<Entity[]> = new ReplaySubject<Entity[]>(1);
  private _completed: boolean = false;

  private _data: Entity[] = [];

  public get data$(): Observable<Entity[]> {
    return this._data$;
  }

  constructor(params: PaginatedRequestParams<Entity>) {
    this.http = params.http;
    this.url = params.url;
    this.deserializer = params.deserializer;
    this.queryParameters = params.queryParameters;
    this._limit = params.limit ?? 10;
    this._page = params.page ?? 1;
    this.pageParamName = params.pageParamName ?? 'page';
    this.limitParamName = params.limitParamName ?? 'limit';
  }

  private newRequest(): Observable<any[]> {
    return this.http
      .get<any[]>(this.url, {
        params: {
          ...(this.queryParameters ?? {}),
          [this.pageParamName]: this._page,
          [this.limitParamName]: this._limit,
        },
      })
      .pipe(
        map((data) => (this.deserializer ? this.deserializer(data) : data))
      );
  }

  private emitData(data: Entity[]): void {
    this._data$.next(data);
    this._data = this._data.concat(data);
    this._page++;
  }

  private emitError(err: any): void {
    this._data$.error(err);
    this._completed = true;
  }

  public next(): void {
    if (this.completed) return;
    this.newRequest()
      .pipe(take(1))
      .subscribe({
        next: (data) => this.emitData(data),
        error: (err) => this.emitError(err),
      });
  }

  public refresh(): void {
    this._completed = false;
    this._data$.complete();
    this._data$ = new ReplaySubject<Entity[]>(1);
  }

  public complete(): void {
    this._data$.complete();
    this._completed = true;
  }

  public get data(): readonly Entity[] {
    return this._data;
  }

  public get completed(): boolean {
    return this._completed;
  }

  public get page(): number {
    return this._page;
  }

  public get limit(): number {
    return this._limit;
  }
}
