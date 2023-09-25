import { Amount, BlogsCharRestrict, Currency, PlanType } from "src/Utilities/Template/types";

export interface IUpdatePlan {
    planName?: string;
    planType?: PlanType;
    amount?: Amount;
    charCount?: BlogsCharRestrict;
    currency?: Currency;
  }
  