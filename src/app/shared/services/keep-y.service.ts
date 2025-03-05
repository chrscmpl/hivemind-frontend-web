import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeepYService {
  private savedYPositions: Record<string, number> = {};

  public set(id: string, y: number): void {
    this.savedYPositions[id] = y;
  }

  public get(id: string): number {
    return this.savedYPositions[id];
  }
}
