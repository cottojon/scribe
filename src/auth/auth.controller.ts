import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    //post request
    @Post('/signup') // validation pipe added for authCredentialsDto
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.authService.signUp(authCredentialsDto);
    }


    //post request
    @Post('/signin') // validation pipe added for authCredentialsDto
    signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        return this.authService.signIn(authCredentialsDto);
    }


    // to test our jwt strategy and getuser decorator
    @Post('/test')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    test(@GetUser() user){
        console.log(user);
    }
}
