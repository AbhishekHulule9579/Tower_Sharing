import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private readonly loadingService: LoadingService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // GET requests load inside their page, so navigation stays responsive.
    if (req.method === 'GET') {
      return next.handle(req);
    }
    this.loadingService.start();
    return next.handle(req).pipe(finalize(() => this.loadingService.finish()));
  }
}
