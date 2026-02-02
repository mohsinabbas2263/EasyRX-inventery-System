import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username: email } });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userId: id } });
  }

  async findAll(branchId?: string): Promise<User[]> {
    if (branchId) {
      return this.usersRepository.find({ where: { branchId } });
    }
    return this.usersRepository.find();
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    return this.usersRepository.save(user);
  }
}
