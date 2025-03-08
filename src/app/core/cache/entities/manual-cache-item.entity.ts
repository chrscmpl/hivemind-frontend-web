/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheKeysEnum } from '../enum/cache-keys.enum';

export interface ManualCacheItem {
  key: CacheKeysEnum;
  value: any;
  parameters: any[];
}
