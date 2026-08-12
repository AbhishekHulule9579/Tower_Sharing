import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = signal(0);
  protected readonly loadingSignal = signal(false);

  readonly loading$ = this.loadingSignal.asReadonly();

  start(): void {
    this.loadingCount.set(this.loadingCount() + 1);
    this.loadingSignal.set(true);
  }

  finish(): void {
    this.loadingCount.set(Math.max(0, this.loadingCount() - 1));
    if (this.loadingCount() === 0) {
      this.loadingSignal.set(false);
    }
  }
}
