export enum AuthType {
    Google = "google",
    Jwt = "jwt",
    Facebook = 'facebook',
    Amazon = 'amazon',
}

export enum Roles {
    Admin = "admin",
    User = "user"
}

export enum PlanType {
    Bronze = "bronze",
    Silver = "silver",
    Gold = "gold",
    Platinum = "platinum",
}

export enum Amount {
    Bronze = 100,
    Silver = 200,
    Gold = 300,
    Platinum = 500,
}

export enum BlogsCharRestrict {
    Bronze = 20,
    Silver = 30,
    Gold = 40,
    Platinum = 50,
}

export enum Currency {
    USD = "usd"
}

export enum PaymentStatus {
    Unpaid = "unpaid",
    Paid = "paid",
    Declined = "declined"
}
  