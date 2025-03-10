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

type DeserializerFn<Entity> = (
  input: any,
  manager: PaginatedRequestManager<Entity>,
) => Entity[];

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

export class PaginatedRequestManager<Entity, Meta = any> {
  private readonly http: HttpClient;
  private readonly url: string;
  private readonly deserializer?: DeserializerFn<Entity>;
  private readonly queryParameters?: Record<string, any>;
  private readonly pageParamName: string;
  private readonly limitParamName: string;
  private _meta: Meta | null = null;
  private _lastPage: number | null = null;

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
        map((data) =>
          this.deserializer ? this.deserializer(data, this) : data,
        ),
      );
  }

  private emitData(data: Entity[]): void {
    if (data.length < this._limit) {
      this._lastPage = this._page;
    }

    // used a for loop so indexes are preserved and
    // empty spaces are inserted in case of a page jump
    for (
      let i = (this._page - 1) * this._limit, j = 0;
      j < data.length;
      i++, j++
    ) {
      this._data[i] = data[j];
    }
    this._data$.next(data);
  }

  private emitError(err: any): void {
    this._data$.error(err);
    this._completed = true;
  }

  public next(): Observable<Entity[]> {
    if (this.completed) return of([]);
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

  public get meta(): Meta | null {
    return this._meta;
  }

  public set meta(value: Meta | null) {
    this._meta = value;
  }

  public getPage(page: number): Observable<Entity[]> {
    if (page < 1) throw new Error('Page number must be greater than 0');

    const pageData = this._data.slice(
      (page - 1) * this._limit,
      page * this._limit,
    );

    if (
      (pageData.length === this._limit &&
        !pageData.includes(undefined as any)) ||
      (this._lastPage === page && pageData.some((item) => item != undefined))
    ) {
      this._page = page;
      return of(pageData);
    }
    this._page = page - 1;

    return this.next();
  }
}
