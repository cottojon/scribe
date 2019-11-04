import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class  ChangeAuthCredentialsDto {
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
     {message: 'password too weak'}) // provide a regular expression with a error message because the default one is too long
    current_password: string;
    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
     {message: 'password too weak'}) // provide a regular expression with a error message because the default one is too long
    new_password: string;
}


/*
REGEX:
Passwords will contain at least 1 upper case letter
Passwords will contain at least 1 lower case letter
Passwords will contain at least 1 number or special character
There is no length validation (min, max) in this regex!
Now let us apply our validation pipe to our signUp han
*/