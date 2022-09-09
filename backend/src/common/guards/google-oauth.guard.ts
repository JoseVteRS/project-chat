import { AuthGuard } from '@nestjs/passport';
import { Providers } from '../enums';

export class GoogleOauthGuard extends AuthGuard(Providers.Google) {
  constructor() {
    super({
      prompt: 'select_account',
    });
  }
}
