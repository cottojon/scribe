import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, Get, Res } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    //post request
    @Post('/signup') // validation pipe added for authCredentialsDto
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }


    //post request
    @Post('/signin') // validation pipe added for authCredentialsDto
    signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }


    // to test our jwt strategy and getuser decorator
    @Post('/test')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    test(@GetUser() user) {
        console.log(user);
    }


    //upload user image
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file, @GetUser() user) {
        console.log(file);
        console.log(user);
    }


    //get user image
    @Get('/image')
    getUserImage(@GetUser() user: User, @Res() res){
       // res.sendFile(fileId, { root: 'avatars' });
    }



    //get user info
    @Get('/user')
    getUser(@GetUser() user: User){
        delete user.salt;
        delete user.password;
        console.log(user);
        return user;
    }

}
