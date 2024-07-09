import { AuthService } from './auth/auth.service';
import { Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from '@/stateful/passport/stateful.local.auth.guard';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './stateful/passport/stateful.local.authenticated.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/customizes';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    //jwwt
    private authService :AuthService,
  ) { }


  @Get()
  getHomePage(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.isAuthenticated();
    return res.render('home', { isAuthenticated })
  }

  @Get('/login')
  async getLoginPage(@Req() req: Request, @Res() res: Response) {
    const isAuthenticated = req.isAuthenticated();
    if (isAuthenticated) {
      return res.redirect("/");
    }
    else return res.render('login')
  }

  @UseGuards(AuthenticatedGuard)
  @Render('user')
  @Get('/user')
  async getUserPage() {
    // const usersList = await this.usersService.findAll();
    // return { users: usersList };
  }

  //tham khảo: https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/
  //https://www.loginradius.com/blog/engineering/guest-post/session-authentication-with-nestjs-and-mongodb/
@Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLoginStateful(@Req() req: Request, @Res() res: Response) {
    return this.authService.login(req.user, res);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    /* destroys user session */
    req.session.destroy(function (err) {
      if (err) console.log(err)
      return res.redirect("/")
    });

  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
