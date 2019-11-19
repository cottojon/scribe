import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, UseInterceptors, UploadedFile, Get, Res, ParseIntPipe, Param } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './user.entity';
import { ChangeAuthCredentialsDto } from './dto/change-auth-credentials.dto';


var fs = require('fs');  // file system

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    // post request
    @Post('/signup') // validation pipe added for authCredentialsDto
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }


    // post request
    @Post('/signin') // validation pipe added for authCredentialsDto
    signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    // upload user image
    // user should only upload a jpeg image or png
    @Post('/upload')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file, @GetUser() user) {
        return this.authService.uploadImage(file, user);
    }


    // get user image
    // 
    @Get('/image')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    getUserImage(@GetUser() user: User, @Res() res): Promise<void> {
        res.contentType('image/jpeg'); // we only respond jpeg/png images
        res.send(user.image);
        return;
    }

    //get user image by id
    //get username by userId
    @Get('/image/:id')
    @UseGuards(AuthGuard())
    async getImageById(@Param('id', ParseIntPipe) id: number, @Res() res): Promise<void> {
        res.contentType('image/jpeg'); // we only respond jpeg/png image
        console.log(await this.authService.getImageById(id));
        res.send(await this.authService.getImageById(id));
        return;
    }


    // get username from accessToken ..
    @Get('/username')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    getUser(@GetUser() user: User) {
        delete user.salt;
        delete user.password;
        delete user.image;
        return user;
    }


    //get username by userId
    @Get('/:id')
    @UseGuards(AuthGuard())
    getUsernameById(@Param('id', ParseIntPipe) id: number): Promise<{username}> {
        return this.authService.getUsernameById(id);
    }


    // reset the password
    // currently only a new password needs t be provided
    @Post('/password_reset')
    @UseGuards(AuthGuard()) // guard/require authorization using jwt strategy class
    changePassword(@Body(ValidationPipe) changeAuthCredentialsDto: ChangeAuthCredentialsDto, @GetUser() user: User): Promise<void>{
        return this.authService.changePassword(changeAuthCredentialsDto, user);
    }

}
