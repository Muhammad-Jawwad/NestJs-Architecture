import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { choosePlanDTO } from '../../Payment/DTO/ChoosePlan.dto';
import { PlanEntity } from 'src/Modules/Plans/Entity/plan.entity';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';
import { ICreatePurchasedPlan } from '../Interfaces/ICreatePurchasedPlan.interface';
import { StripeConfig } from 'src/Configuration/Stripe/stripe.config';
import { ConfigService } from '@nestjs/config';
import { createCustomerDTO } from '../DTO/CreateCustomer.dto';
import { PaymentStatus } from 'src/Utilities/Template/types';
import { paymentDTO } from '../DTO/Payment.dto';
import { isNumber } from 'class-validator';

@Injectable()
export class PaymentService {
    constructor(
        private readonly stripeConfig: StripeConfig,
        private readonly configService: ConfigService,

        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(PlanEntity) private planRepository: Repository<PlanEntity>,
        @InjectRepository(PurchasedPlanEntity) private purchasedPlanRepository: Repository<PurchasedPlanEntity>,
    ) {}

    async payment(paymentBody: paymentDTO){
        try{
            const { payment_method } = paymentBody;
            const choosePlanBody = {
                userId: paymentBody.userId,
                planId: paymentBody.planId
            }
            const choosePlan = await this.choosePlan(choosePlanBody);
            if(choosePlan.paymentStatus !== PaymentStatus.Unpaid){
                console.log('Purchased plan status is not unpaid')
                throw new HttpException('Purchased plan status is not unpaid',HttpStatus.BAD_REQUEST)
            }
            console.log("choosePlan",choosePlan);
            var purchasedPlanId = choosePlan.id;
            const {  planId } = choosePlan;
            const plan = await this.planRepository.findOne({
                where: {
                    id: planId.id
                }
            });
            console.log("plan",plan);
            const { amount, currency } = plan;
            const paymentIntent = await this.stripeConfig.stripe.paymentIntents.create({
                amount,
                currency,
                automatic_payment_methods: {enabled: true},
                payment_method
            })
            console.log("paymentIntent",paymentIntent)
            if(paymentIntent.status === "requires_confirmation"){
                console.log("paymentIntent.status",paymentIntent.status)
                const paymentIntentId = paymentIntent.id;

                const confirmPaymentIntent = await this.stripeConfig.stripe.paymentIntents.confirm(
                    paymentIntentId, 
                    {
                        payment_method,
                        return_url: 'https://www.google.com/',
                    }
                );
                console.log("confirmPaymentIntent",confirmPaymentIntent);
                if(confirmPaymentIntent.status === "succeeded"){
                    console.log("confirmPaymentIntent.status",confirmPaymentIntent.status);
                    
                    //Update purchased plan
                    const updatePaymentStatus = await this.updatePlan(purchasedPlanId,PaymentStatus.Paid)

                    return {
                        msg: "Transaction completed successfully...",
                        purchasedPlan: updatePaymentStatus
                    }
                }
            }
        } catch (error) {
            // Handle Stripe API errors here
            switch (error.type) {
            case 'StripeCardError':
                // A declined card error
                throw new HttpException('StripeCardError:', HttpStatus.BAD_REQUEST);
                break;
            case 'StripeRateLimitError':
                // Too many requests made to the API too quickly
                throw new HttpException('StripeRateLimitError:', HttpStatus.BAD_REQUEST);
                break;
            case 'StripeInvalidRequestError':
                // Invalid parameters were supplied to Stripe's API
                throw new HttpException('StripeInvalidRequestError:', HttpStatus.BAD_REQUEST);
                break;
            case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                throw new HttpException('StripeAPIError:', HttpStatus.BAD_REQUEST);
                break;
            case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                throw new HttpException('StripeConnectionError:', HttpStatus.BAD_REQUEST);
                break;
            case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                throw new HttpException('StripeAuthenticationError:', HttpStatus.BAD_REQUEST);
                break;
            default:
                // Handle any other types of unexpected errors
                throw new HttpException('Unexpected error:', HttpStatus.BAD_REQUEST);
                break;
            }
        }
    }
    async updatePlan(purchasedPlanId:number, paymentStatus:PaymentStatus){
        try{
            const purchasedPlan = await this.purchasedPlanRepository.findOne({
                where: {
                    id: purchasedPlanId
                }
            })
            if(!purchasedPlan){
                throw new HttpException('No Selected plan found',HttpStatus.NOT_FOUND);
            }
            const updateBody = {
                paymentStatus
            }
            const updatePurchasedPlan = await this.purchasedPlanRepository.update({id: purchasedPlanId}, updateBody);
            const updatedPurchasedPlan = await this.purchasedPlanRepository.findOne({
                where: {
                    id: purchasedPlanId
                }
            })
            return updatedPurchasedPlan;

        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
    async choosePlan(planBody: choosePlanDTO) {
        try {
            const { userId } = planBody;
            const { planId } = planBody;
            const isUserExist = await this.userRepository.findOne({
                where: {
                    id: userId
                }
            });
            if (!isUserExist) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const isPlanExist = await this.planRepository.findOne({
                where: {
                    id: planId
                }
            });
            if (!isPlanExist) {
                throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
            }

            const isAlreadyPurchased = await this.purchasedPlanRepository.findOne({
                where: {
                    userId: {
                        id: userId
                    },
                    planId: {
                        id: planId
                    }
                }
            });
            if (isAlreadyPurchased) {
                return isAlreadyPurchased;
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
            const createdPurchasedPlan = await this.purchasedPlanRepository.save(checkedPurchasedPlan);

            return createdPurchasedPlan;
          

        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    checking() {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        // const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        console.log('STRIPE_SECRET_KEY:', stripeSecretKey);
        return stripeSecretKey;
    }

    async createCustomer(customerBody: createCustomerDTO) {
        try {
            const { name, email } = customerBody
            const newCustomer = await this.stripeConfig.stripe.customers.create({
                name,
                email
            });
            return newCustomer;
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchCustomer() {
        try {
            const customers = await this.stripeConfig.stripe.customers.list();
            return customers;
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async createCharge() {
        try {

        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async createToken() {
        let card = {
            number: '4242424242424242',
            exp_month: 9,
            exp_year: 2024,
            cvc: '314',
        }
        
        const token = await this.stripeConfig.stripe.tokens.create({
            card: JSON.stringify({
                number: '4242424242424242',
                exp_month: 9,
                exp_year: 2024,
                cvc: '314',
            })
        });
        return token;
    }

    async importExcel(jsonData: any) {
        try {
            const newArr = [];
    
            for (const item of jsonData) {
                if (isNumber(item.userId) && isNumber(item.planId)) {
                    const planBody = {
                        userId: item.userId,
                        planId: item.planId
                    };
    
                    const userPlan = await this.choosePlanFromExcel(planBody);
    
                    if (userPlan) {
                        newArr.push(userPlan);
                    }
                }
            }
            return {
                success: true,
                message: 'All the valid data has been imported successfully',
                newArr
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred during data import'
            };
        }
    }
    
    async choosePlanFromExcel(planBody: choosePlanDTO) {
        try {
            const { userId, planId } = planBody;
            const isUserExist = await this.userRepository.findOne({
                where: {
                    id: userId
                }
            });
    
            if (!isUserExist) {
                return null;
            }
    
            const isPlanExist = await this.planRepository.findOne({
                where:{
                    id: planId
                }  
            });
    
            if (!isPlanExist) {
                return null;
            }
    
            const isAlreadyPurchased = await this.purchasedPlanRepository.findOne({
                where:{
                    userId: { 
                        id: userId 
                    },
                    planId: { 
                        id: planId 
                    }
                }
            });
    
            if (isAlreadyPurchased) {
                return isAlreadyPurchased;
            }
    
            // Implement the payment method here
    
            const newPurchasedPlan = this.purchasedPlanRepository.create({
                userId: { 
                    id: userId 
                },
                planId: { 
                    id: planId 
                }
            });
    
            const checkedPurchasedPlan = newPurchasedPlan;
            const createdPurchasedPlan = await this.purchasedPlanRepository.save(checkedPurchasedPlan);
    
            return createdPurchasedPlan;
        } catch (error) {
            throw new Error('An error occurred while processing Excel data');
        }
    }
}
