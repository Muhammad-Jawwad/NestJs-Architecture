import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../Entity/blog.entity';
import { Repository } from 'typeorm';
import { createBlogDTO } from '../DTO/CreateBlog.dto';
import { PurchasedPlanEntity } from 'src/Modules/Plans/Entity/purchasedPlan.entity';
import { PlanEntity } from 'src/Modules/Plans/Entity/plan.entity';
import { moveBlogImage } from 'src/Utilities/Image/moveBlogImage';
import { updateBlogDTO } from '../DTO/UpdateBlog.dto';
import { IUpdateBlog } from '../Intrerfaces/IBlogUpdate.interface.dto';
import { clickLikeDTO } from '../DTO/ClickLike.dto';
import { LikesEntity } from '../Entity/likes.entity';
import { ICreateLike } from '../Intrerfaces/ICreateLike.interface';
import { UserEntity } from 'src/Modules/Users/Entity/user.entity';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(PlanEntity) private planRepository: Repository<PlanEntity>,
        @InjectRepository(LikesEntity) private likesRepository: Repository<LikesEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(PurchasedPlanEntity) private purchasedPlanRepository: Repository<PurchasedPlanEntity>,
    ){}

    async createBlog(blogBody: createBlogDTO){
        try{
            const [isBlogExist, purchasedPlan] = await Promise.all([
                await this.blogRepository.findOne({
                    where: {
                        blogTitle: blogBody.blogTitle,
                        purchasedPlanId: {
                            id: blogBody.purchasedPlanId
                        }
                    }
                }),
                await this.purchasedPlanRepository.findOne({
                    where: {
                        id: blogBody.purchasedPlanId
                    }
                })
            ]);
            if(isBlogExist){
                throw new HttpException('Blog with the same plan and blog title already exist', HttpStatus.BAD_REQUEST);
            }
            if(!purchasedPlan){
                throw new HttpException('Purchased Plan with this id not found', HttpStatus.NOT_FOUND);
            }
            if(purchasedPlan.paymentStatus !== 'paid'){
                throw new HttpException('You cannot create a blog until you paid the payment', HttpStatus.NOT_ACCEPTABLE);
            }
            const { planId } = purchasedPlan;
            const plan = await this.planRepository.findOne({
               where: {
                id: planId.id
               }
            });
            const { charCount } = plan;
            console.log("charCount",charCount,"blogBody.blogDescription.length", blogBody.blogDescription.length)
            if(blogBody.blogDescription.length > charCount){
                throw new HttpException('Blog description char limit exceeded', HttpStatus.NOT_ACCEPTABLE);
            }

            const newPath = moveBlogImage(blogBody.image);
            console.log(newPath);
            const newBlog = this.blogRepository.create({
                blogTitle: blogBody.blogTitle,
                blogDescription: blogBody.blogDescription,
                image: newPath,
                purchasedPlanId: {
                    id: blogBody.purchasedPlanId
                }
            });
            const createdBlog = await this.blogRepository.save(newBlog);
            return {
                statusCode: HttpStatus.OK,
                msg: "New Blog successfully Created",
                createdBlog
            }
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchBlogs(){
        try{
            const blogs = await this.blogRepository.find();
            return blogs;
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchBlogById(id: number){
        try{
            const blogById = await this.blogRepository.findOne({
                where:{
                    id
                }
            });
            if(!blogById){
                throw new HttpException('No Blog found at that id', HttpStatus.NOT_FOUND);
            }
            return blogById;
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async fetchBlogByUserId(userId: number){
        try{
            const blogsByUserId = await this.blogRepository.find({
                where:{
                    purchasedPlanId:{
                        userId:{
                            id: userId
                        }
                    }
                }
            });
            if(blogsByUserId.length === 0){
                throw new HttpException('No Blog created by that user', HttpStatus.NOT_FOUND);
            }
            return blogsByUserId;
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updateBlog(id: number, blogBody: updateBlogDTO){
        try{
            if(Object.keys(blogBody).length === 0){
                throw new HttpException('Empty Body is not allowed', HttpStatus.NOT_ACCEPTABLE);
            }
            const isBlogExist = await this.blogRepository.findOne({
                where: {
                    id
                }
            });
            if(!isBlogExist){
                throw new HttpException('Blog not found', HttpStatus.BAD_REQUEST);
            }
            //If body has blogDescription to update
            if(blogBody.blogDescription){
                const { purchasedPlanId } = isBlogExist;
                const plan = await this.planRepository.findOne({
                where: {
                    id: purchasedPlanId.planId.id
                }
                });
                const { charCount } = plan;
                console.log("charCount",charCount,"blogBody.blogDescription.length", blogBody.blogDescription.length)
                if(blogBody.blogDescription.length > charCount){
                    throw new HttpException('Blog description char limit exceeded', HttpStatus.NOT_ACCEPTABLE);
                }
            }
            if(blogBody.image){
                const newPath = moveBlogImage(blogBody.image);
                console.log(newPath);
                blogBody.image = newPath;
            }

            const updateBlog : IUpdateBlog = blogBody;
            await this.blogRepository.update(id, updateBlog);
            const updatedBlog = await this.blogRepository.findOne({
                where:{
                    id
                }
            })
            return {
                statusCode: HttpStatus.OK,
                msg: "Blog successfully Updated",
                updatedBlog
            }
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async clickLike(likeBody: clickLikeDTO){
        try{
            const { userId, blogId } = likeBody;
            const [isBlogExist,User] = await Promise.all([
                await this.blogRepository.findOne({
                    where:{
                        id: blogId
                    }
                }),
                await this.userRepository.findOne({
                    where: {
                        id: userId
                    }
                })
            ]);
            if(!User){
                throw new HttpException('Invalid User Id ', HttpStatus.NOT_FOUND);
            }
            if(!isBlogExist){
                throw new HttpException('Invalid Blog Id ', HttpStatus.NOT_FOUND);
            }
            const alreadyLiked = await this.likesRepository.findOne({
                where: {
                    userId: {
                        id: userId
                    },
                    blogId: {
                        id: blogId
                    }
                }
            });
            if(!alreadyLiked){
                const likeABlog: ICreateLike = this.likesRepository.create({
                    liked: true,
                    userId: {
                        id: userId
                    },
                    blogId: {
                        id: blogId
                    }
                });
                const { numberOfLikes } = isBlogExist;
                const [newLike] = await Promise.all([
                    await this.likesRepository.save(likeABlog),
                    await this.blogRepository.update(
                        isBlogExist.id,
                        {
                            numberOfLikes: numberOfLikes + 1
                        }
                    )
                ]);
                return {
                    statusCode: HttpStatus.OK,
                    msg: "Like Button is successfully handled"
                }
            }
            const { numberOfLikes } = isBlogExist;
            var newNumberOfLikes = numberOfLikes
            const likedStatus = !alreadyLiked.liked; 
            if(likedStatus){
                newNumberOfLikes += 1;
            } else{
                newNumberOfLikes -= 1;
            }
            await Promise.all([
                await this.likesRepository.update(
                    alreadyLiked.id,
                    {
                        liked: likedStatus
                    }
                ),
                await this.blogRepository.update(
                    isBlogExist.id,
                    {
                        numberOfLikes: newNumberOfLikes
                    }
                )
            ]);
            return {
                statusCode: HttpStatus.OK,
                msg: "Like Button is successfully handled"
            }
        } catch (error) {
            throw new HttpException(
                error.message,
                error.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
