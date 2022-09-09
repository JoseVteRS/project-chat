import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

import { Request, Response } from 'express';

import { CurrentUser, Roles, Verified as Status } from '../../../common/decorators';
import { AccountStatus, Providers, Role } from '../../../common/enums';
import { FacebookOauthGuard, GoogleOauthGuard, JwtAuthGuard, RolesGuard, VerifiedGuard } from '../../../common/guards';
import { CreateAccountDto, LoginDto, PasswordValuesDto } from '../../../common/dtos';
import { User } from '../../../common/entities';
import { AuthRequest, AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  async register(@Body() credentials: CreateAccountDto, @Req() req: Request) {
    return this.authService.register(credentials, req);
  }

  @HttpCode(200)
  @Post('local/login')
  async login(@Body() credentials: LoginDto, @Req() req: Request) {
    return this.authService.login(credentials, req);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req: Request) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    return this.authService.socialProviderLogin(req, Providers.Google);
  }

  @Get('facebook')
  @UseGuards(FacebookOauthGuard)
  async facebookAuth(@Req() _req: Request) {
    // Guard redirects
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(@Req() req: AuthRequest, @Res() _res: Response) {
    return this.authService.socialProviderLogin(req, Providers.Facebook);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @SkipThrottle(true)
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getAdminData() {
    return 'only admins should see this';
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm')
  confirmAccount(@CurrentUser() user: User, @Query('token') token: string) {
    return this.authService.confirmAccount(user, token);
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm-resend')
  resendConfirmToken(@CurrentUser() user: User) {
    return this.authService.resendConfirmationToken(user);
  }

  @Patch('password/reset')
  resetPassword(@Body('email') email: string) {
    return this.authService.resetPassword(email);
  }

  @Patch('password/change')
  @Status(AccountStatus.VERIFIED)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  changePassword(@CurrentUser() user: User, @Body() passwordValues: PasswordValuesDto) {
    return this.authService.changePassword(user, passwordValues);
  }

  @Patch('password/new')
  setNewPassword(@Body('newPassword') newPassword: string, @Query('token') token: string) {
    return this.authService.setNewPassword(newPassword, token);
  }
}
