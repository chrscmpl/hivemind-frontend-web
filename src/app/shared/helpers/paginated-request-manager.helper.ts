/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  ReplaySubject,
  catchError,
  map,
  of,
  take,
  tap,
  throwError,
} from 'rxjs';

type DeserializerFn<Entity> = (input: any) => Entity[];

export interface PaginatedRequestParams<Entity> {
  http: HttpClient;
  url: string;
  deserializer?: DeserializerFn<Entity>;
  query?: Record<string, any>;
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
    this.queryParameters = params.query;
    this._limit = params.limit ?? 10;
    this._page = params.page !== undefined ? params.page - 1 : 0;
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
        map((data) => (this.deserializer ? this.deserializer(data) : data)),
      );
  }

  private emitData(data: Entity[]): void {
    this._data$.next(data);
    this._data = this._data.concat(data);
  }

  private emitError(err: any): void {
    this._data$.error(err);
    this._completed = true;
  }

  public next(): Observable<Entity[] | null> {
    if (this.completed) return of(null);
    this._page++;
    return this.newRequest().pipe(
      take(1),
      tap((data) => {
        this.emitData(data);
      }),
      catchError((err) => {
        this.emitError(err);
        return throwError(() => err);
      }),
    );
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

  public get mutableData(): Entity[] {
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

  public get query(): Record<string, any> {
    return this.queryParameters ?? {};
  }

  public getPage(page: number): readonly Entity[] {
    if (page < 1) throw new Error('Page number must be greater than 0');
    return this._data.slice((page - 1) * this._limit, page * this._limit);
  }
}
