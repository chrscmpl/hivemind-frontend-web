/* eslint-disable @typescript-eslint/no-explicit-any */
import { IObservableCacheConfig } from 'ts-cacheable/dist/cjs/common/IObservableCacheConfig';
import { CacheKeysEnum } from '../enum/cache-keys.enum';
import { GlobalCacheConfig, ICachePair } from 'ts-cacheable';
import { Subject } from 'rxjs';
import { IdeaPaginationParams } from '@app/shared/services/idea-fetch.service';
import { CommentPaginationParams } from '@app/shared/services/comment-fetch.service';
import { cacheBusters } from './cache-busters.helper';

type cacheModifierFn = (cachePairs: ICachePair<any>[]) => ICachePair<any>[];

export const cacheConfigs: Record<
  CacheKeysEnum,
  IObservableCacheConfig & {
    // required
    maxAge: IObservableCacheConfig['maxAge'];
    cacheHasher: IObservableCacheConfig['cacheHasher'];
  }
> = {
  [CacheKeysEnum.IDEA]: {
    cacheKey: CacheKeysEnum.IDEA,
    maxAge: 1000 * 60 * 5,
    maxCacheCount: 32,
    cacheBusterObserver: cacheBusters.ideas,
    cacheHasher: (params) => params.map((obj) => obj.toString()),
    cacheModifier: new Subject<cacheModifierFn>(),
  },
  [CacheKeysEnum.IDEA_PAGINATION]: {
    cacheKey: CacheKeysEnum.IDEA_PAGINATION,
    maxAge: 1000 * 60 * 10,
    maxCacheCount: 8,
    cacheBusterObserver: cacheBusters.ideas,
    cacheHasher: (params) =>
      params.map((obj: IdeaPaginationParams) => JSON.stringify(obj.query)),
    cacheModifier: new Subject<cacheModifierFn>(),
  },
  [CacheKeysEnum.COMMENT_PAGINATION]: {
    cacheKey: CacheKeysEnum.IDEA_PAGINATION,
    maxAge: 1000 * 60 * 5,
    maxCacheCount: 16,
    cacheBusterObserver: cacheBusters.comments,
    cacheHasher: (params) =>
      params.map((obj: CommentPaginationParams) => new String(obj.ideaId)),
    cacheModifier: new Subject<cacheModifierFn>(),
  },
};

Object.values(cacheConfigs).forEach((config) => {
  Object.setPrototypeOf(config, GlobalCacheConfig);
});
