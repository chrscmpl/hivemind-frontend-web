/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { cacheEvents } from '../helpers/cache-events.helper';
import { ManualCacheItem } from '../entities/manual-cache-item.entity';
import { cacheConfigs } from '../helpers/cache-configs.helper';
import { DEFAULT_HASHER, ICachePair } from 'ts-cacheable';
import { isEqual } from 'lodash-es';
import { IObservableCacheConfig } from 'ts-cacheable/dist/cjs/common/IObservableCacheConfig';
import { cacheBusters } from '../helpers/cache-busters.helper';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public readonly cacheEvents = cacheEvents;
  public readonly cacheBusters = cacheBusters;

  public manualAdd(itemToAdd: ManualCacheItem) {
    const config = cacheConfigs[itemToAdd.key];

    config.cacheModifier?.next((items) => {
      const hash = this.hash(itemToAdd.parameters, config.cacheHasher);

      const oldItem = this.findHash(hash, items);

      if (oldItem) {
        oldItem.created = new Date();
        return items;
      }

      if (config.maxCacheCount && items.length >= config.maxCacheCount) {
        this.removeOldest(items);
      }

      items.push({
        response: itemToAdd.value,
        parameters: hash,
        created: new Date(),
      });

      return items;
    });
  }

  public clear(): void {
    Object.values(this.cacheEvents).forEach((buster) => buster.next());
  }

  private hash(
    parameters: any[],
    cacheHasher: IObservableCacheConfig['cacheHasher'],
  ) {
    return cacheHasher?.(parameters) ?? DEFAULT_HASHER(parameters);
  }

  private findHash(hash: any, items: ICachePair<any>[]) {
    return items.find((i) => isEqual(i.parameters, hash));
  }

  private removeOldest(items: ICachePair<any>[]): void {
    const oldest = items.reduce<{ created: Date; index: number }>(
      (oldest, item, index) =>
        item.created < oldest.created
          ? { created: item.created, index }
          : oldest,
      { created: new Date(), index: 0 },
    );

    items.splice(oldest.index, 1);
  }
}
