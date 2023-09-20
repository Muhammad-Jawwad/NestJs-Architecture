import { Roles } from "src/Utilities/Template/types";

export interface IAuthPaylaod {
    email: string;
    id: number;
    role: Roles;
}
  