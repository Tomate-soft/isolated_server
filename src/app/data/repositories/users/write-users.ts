import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
// import { hash } from 'bcryptjs';

@Injectable()
export class WriteUsers {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async changePassword(id: string, newPassword: number) {
    // const newPass = await hash(newPassword, 10);
    return this.userModel.findByIdAndUpdate(id, { pinPos: newPassword });
  }
}
