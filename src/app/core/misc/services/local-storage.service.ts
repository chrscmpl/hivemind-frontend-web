import { Inject, Injectable } from '@angular/core';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private permission: boolean = true;

  constructor(@Inject(WA_LOCAL_STORAGE) private readonly storage: Storage) {}

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    if (this.permission) this.storage.setItem(key, value);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }
}
