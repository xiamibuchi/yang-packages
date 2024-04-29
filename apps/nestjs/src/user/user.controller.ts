import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user/:id')
  async getUserById(@Req() req, @Res() res) {
    const id = req.params.id;
    const user = await this.userService.getUserById(id);
    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send({
        code: -1,
        msg: 'User not found',
      });
    }
  }
}
