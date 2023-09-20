import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { PlansService } from './Services/plans.service';
import { updatePlanDTO } from './DTO/UpdatePlan.dto';
import { createPlanDTO } from './DTO/CreatePlan.dto';

@Controller('plans')
export class PlansController {
    constructor(private plansService: PlansService){}

    @Post('create')
    @UsePipes(ValidationPipe)
    async createPlan(@Body() planBody: createPlanDTO){
        const result = await this.plansService.createPlan(planBody);
        return result;
    }

    @Get()
    async fetchPlan(){
        const result = await this.plansService.fetchPlans();
        return result;
    }

    @Get(':planId')
    async getPlanById(@Param('planId', ParseIntPipe) id: number){
        const result = await this.plansService.fetchPlanById(id);
        return result;
    }

    @Patch('update/:planId')
    @UsePipes(ValidationPipe)
    async updatePlan(@Param('planId', ParseIntPipe) id: number, @Body() planReq: updatePlanDTO){
        if(Object.keys(planReq).length === 0 ){
            throw new HttpException('Empty Body request is not allowed',HttpStatus.BAD_REQUEST);
        }
        const result = await this.plansService.updatePlan(id, planReq);
        return result;
    }

    @Delete('delete/:planId')
    async deletePlan(@Param('planId', ParseIntPipe) id: number){
        const result = await this.plansService.deletePlan(id);
        return result;
    }

}
