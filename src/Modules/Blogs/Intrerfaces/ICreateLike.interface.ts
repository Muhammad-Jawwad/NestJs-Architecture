export interface ICreateLike {
    liked: boolean;
    userId: {
        id:number;
    };
    blogId: {
        id:number;
    };
}