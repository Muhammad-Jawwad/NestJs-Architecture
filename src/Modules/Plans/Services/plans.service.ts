import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from '../Entity/plan.entity';
import { updatePlanDTO } from '../DTO/UpdatePlan.dto';
import { IUpdatePlan } from '../Interfaces/IUpdatePlan.interface';
import { createPlanDTO } from '../DTO/CreatePlan.dto';
import { ICreatePlan } from '../Interfaces/ICreatePlan.interface';

@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(PlanEntity) private planRepository: Repository<PlanEntity>,
    ){}

    async createPlan(planBody: createPlanDTO){
        try{
            
            const { planName } = planBody;
            const { planType } = planBody;

            const isPlanExist = await this.planRepository.findOne({
                where: { 
                    planName,
                    planType,
                }
            });
            if(isPlanExist){
                throw new HttpException('Plan with this name and type is already exist', HttpStatus.BAD_REQUEST)
            }
            const newPlanBody: ICreatePlan = planBody
            const newPlan = this.planRepository.create(newPlanBody);
            const createdPlan = await this.planRepository.save(newPlan);
            return createdPlan;         
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchPlans(){
        try{
            const plans = await this.planRepository.find();
            if(plans.length === 0 ){
                throw new HttpException('No plans found',HttpStatus.NOT_FOUND);
            }
            return plans;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchPlanById(id: number){
        try{
            const planById = await this.planRepository.findOne({
                where: { id }
            });
            if(!planById){
                throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
            }
            return planById;
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updatePlan(id : number, planRequest : updatePlanDTO){
        try{
            const plan = await this.planRepository.findOne({
                where: { id }
            })
            console.log(plan);
            if(!plan){
                throw new HttpException('Plan not found at that Id', HttpStatus.NOT_FOUND);
            }
            const updatePlan: IUpdatePlan = planRequest;
            await this.planRepository.update({ id }, updatePlan);
            return {
                message: 'Plan Updated Sucessfully',
            }
        }catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async deletePlan(id: number){
        try{
            const plan = await this.planRepository.findOne({
                where: { id }
            })
            console.log(plan);
            if(!plan){
                throw new HttpException('Plan not found at that Id', HttpStatus.NOT_FOUND);
            }
            await this.planRepository.delete({id})
            return {
                message: `Plan having id: ${id} is deleted successfully...`
            }
        }catch(error){
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
