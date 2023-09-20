import { Roles } from "src/Utilities/Template/types";

export interface IJwtAuth {
    // type: string;
    email: string; 
    password: string; 
    role: Roles;
}
  