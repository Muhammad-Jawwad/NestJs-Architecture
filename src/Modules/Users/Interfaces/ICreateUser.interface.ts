import { Roles } from "src/Utilities/Template/types";

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  loginType: boolean;
  age: number;
  role: Roles
  password: string;
  contact: string;
}
