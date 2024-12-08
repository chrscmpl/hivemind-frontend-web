import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly _expanded: WritableSignal<boolean> = signal(false);

  get expanded(): Signal<boolean> {
    return this._expanded;
  }

  public show(): void {
    this._expanded.set(true);
  }

  public hide(): void {
    this._expanded.set(false);
  }

  public toggle(): void {
    this._expanded.update((value) => !value);
  }
}
