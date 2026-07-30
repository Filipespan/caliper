import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

export const apiKeyInterceptor: HttpInterceptorFn = (request, next) => {
  const key = inject(SettingsService).apiKey();
  if (key === null || !request.url.includes('googleapis.com')) {
    return next(request);
  }
  return next(request.clone({ params: request.params.set('key', key) }));
};
