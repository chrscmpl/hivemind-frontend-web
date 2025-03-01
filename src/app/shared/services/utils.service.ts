import { Injectable } from '@angular/core';
import { take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public runAfterCD(f: () => unknown): void {
    timer(0)
      .pipe(take(1))
      .subscribe(() => f());
  }
}
