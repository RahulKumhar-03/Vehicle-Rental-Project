import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { provideHttpClient} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    AuthService, 
    UserService,
    provideHttpClient(), 
    provideAnimations(), 
    provideAnimations(),
  ]
};
