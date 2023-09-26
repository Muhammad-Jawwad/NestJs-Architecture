import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './Services/blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './Entity/blog.entity';
import { PlanEntity } from '../Plans/Entity/plan.entity';
import { PurchasedPlanEntity } from '../Plans/Entity/purchasedPlan.entity';
import { LikesEntity } from './Entity/likes.entity';
import { UserEntity } from '../Users/Entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity, 
      PlanEntity, 
      PurchasedPlanEntity, 
      LikesEntity, 
      UserEntity
    ])
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
