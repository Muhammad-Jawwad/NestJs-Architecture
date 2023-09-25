import { Amount, BlogsCharRestrict, Currency, PlanType } from "src/Utilities/Template/types";

export interface ICreatePlan {
    planName: string;
    planType: PlanType;
    amount: Amount;
    currency: Currency;
    charCount: BlogsCharRestrict;
  }
  