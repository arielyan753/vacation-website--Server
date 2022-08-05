import RoleModel from "../03-models/role-model";
import Joi from 'joi';


class UserModel {
    public userId: number|string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: RoleModel;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }

           // Create schema for USER: 
           private static schemaUser = Joi.object({
            userId: Joi.optional(),
            firstName: Joi.string().required().max(50).min(2),
            lastName: Joi.string().required().max(50).min(2),
            username: Joi.string().required().max(20).min(4),
            password: Joi.string().required().max(20).min(4),
            role: Joi.optional()
        });
    
        // Validate put request: 
        public validateUser(): string {
    
            // Validate current object: 
            const result = UserModel.schemaUser.validate(this);
    
            // Return error message if validate failed or undefined if validate succeeds: 
            return result.error?.message;
        }

    

}

export default UserModel;