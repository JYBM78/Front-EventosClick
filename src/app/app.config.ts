import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { usuarioInterceptor } from './interceptor/usuario.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [
   provideRouter(routes),
   provideHttpClient(withInterceptors([usuarioInterceptor]))
 ]
};
