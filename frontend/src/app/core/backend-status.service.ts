import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private readonly offlineSignal = signal(false);
  readonly offline$ = this.offlineSignal.asReadonly();

  setOffline(value: boolean): void {
    this.offlineSignal.set(value);
  }
}
