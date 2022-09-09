import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  NotContains,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({
    message: 'Email cannot be empty or whitespace',
  })
  @IsEmail({
    message: 'Email should be email',
  })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty or whitespace' })
  @NotContains(' ', {
    message: 'Password cannot be empty or whitespace',
  })
  @Length(6, 100, {
    message: 'Password must be between 6 and 100 characters long',
  })
  password: string;

  @IsNotEmpty({
    message: 'First name cannot be empty or whtiespace',
  })
  @Length(2, 30, {
    message: 'First name must be between 3 and 30 characters long',
  })
  firstName: string;

  @IsNotEmpty()
  @Length(3, 50)
  lastName: string;

  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[\w](?!.*?\.{2})[\w. ]{1,30}[\w]$/, {
    message:
      'Display name can include only letters, numbers and space between words and be max 30 characters long',
  })
  displayName: string;
}
