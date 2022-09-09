import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Providers } from '../enums';

@Injectable()
export class FacebookOauthGuard extends AuthGuard(Providers.Facebook) {}
