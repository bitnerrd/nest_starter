import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { VisitorEntity } from './entities/visitors/visitors.entity';
import { CreateVisitorDto } from './user/dtos/update-user.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>
  ) {

  }
  getHello(): string {
    return 'Open Advisor!';
  }

  async createVisitor(dto: CreateVisitorDto) {
    console.log("APP Modile ", dto);
    let crrDate = new Date;
    crrDate.setHours(0);
    crrDate.setMinutes(0);
    crrDate.setSeconds(0);
    crrDate.setMilliseconds(0);
    const isExist = await this.visitorRepository.findOne({
      where: {
        userIp: dto.userIp,
        createdAt: MoreThan(crrDate)
      }
    });

    if (isExist) {
      isExist.count++;
      return await isExist.save();
    } else {
      return await this.visitorRepository.save(
        this.visitorRepository.create(dto)
      );
    }


  }
}
