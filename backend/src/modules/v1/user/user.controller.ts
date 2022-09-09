import { Body, Controller, Patch, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CurrentUser, Verified as Status } from '../../../common/decorators';
import { AccountStatus } from '../../../common/enums';
import { JwtAuthGuard, VerifiedGuard } from '../../../common/guards';
import { UpdateUserDto } from '../../../common/dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Status(AccountStatus.VERIFIED)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Patch('update')
  updateProfile(@CurrentUser('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.userService.updateProfile(id, updateData);
  }
}
