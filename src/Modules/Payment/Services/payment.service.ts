import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { choosePlanDTO } from '../../Payment/DTO/ChoosePlan.dto';
import { PlanEntity } from 'src/Modules/Plans/Entity/plan.entity';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { ICreatePurchasedPlan } from '../Interfaces/ICreatePurchasedPlan.interface';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(PlanEntity) private planRepository: Repository<PlanEntity>,
        @InjectRepository(PurchasedPlanEntity) private purchasedPlanRepository: Repository<PurchasedPlanEntity>,
    ){}

    async choosePlan(planBody: choosePlanDTO){
        try{
            const { userId } = planBody;
            const { planId } = planBody;
            const isUserExist = await this.userRepository.findOne({
                where:{
                    id:userId
                }
            });
            if(!isUserExist){
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isPlanExist = await this.planRepository.findOne({
                where: {
                    id: planId
                }
            });
            if(!isPlanExist){
                throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
            }

            const isAlreadyPurchased = await this.purchasedPlanRepository.findOne({
                where:{
                    userId:{
                        id: userId
                    },
                    planId: {
                        id: planId
                    }
                }
            });
            if(isAlreadyPurchased){
                throw new HttpException('Plan Already purchased', HttpStatus.NOT_ACCEPTABLE);
            }

            // Implement the payment method before that

            const newPurchasedPlan = this.purchasedPlanRepository.create({
                userId: {
                    id: userId
                },
                planId: {
                    id: planId
                }
            });

            const checkedPurchasedPlan: ICreatePurchasedPlan = newPurchasedPlan;
            const createdPurchasedPlan =  await this.purchasedPlanRepository.save(checkedPurchasedPlan);

            return {
                msg: 'Plan succussfully selected after payment...',
                createdPurchasedPlan
            }

        }catch(error){
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
