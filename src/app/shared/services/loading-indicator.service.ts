import { Injectable } from '@angular/core';
import { LoadingIndicator } from '../helpers/loading-indicator.helper';

@Injectable({
  providedIn: 'root',
})
export class LoadingIndicatorService {
  public getLoadingIndicator(startDelay: number): LoadingIndicator {
    return new LoadingIndicator(startDelay);
  }
}
