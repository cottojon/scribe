import { createParamDecorator } from "@nestjs/common";
import { User } from './user.entity';

// our custom decorator to extract user from request object for authorization
// data = data provided to the decorator
// req = the request object 
// ignore data for now since we are not going to call this decorator with any data
export const GetUser = createParamDecorator((data, req): User =>{
    return req.user; // return the user in the http request after validate method from the jwtStrategy has placed it in
});


// whatever we return from the arrow function above is going to be set to the parameter that is decorated in our controllers/handlers