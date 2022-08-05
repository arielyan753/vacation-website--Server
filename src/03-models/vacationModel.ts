import { UploadedFile } from "express-fileupload";
import Joi from 'joi';

class VacationModel  {
    public vacationId: number; 
    public description: string; 
    public location: string;
    public image: UploadedFile;
    public imageName: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public followers: number;
    public userId: number|null;
    public followedVacation: boolean;

    public constructor(vacation: VacationModel) {
      this.vacationId = vacation.vacationId,
      this.description = vacation.description,
      this.location = vacation.location,
      this.image = vacation.image;
      this.imageName = vacation.imageName,
      this.startDate = vacation.startDate,
      this.endDate = vacation.endDate,
      this.startDate = vacation.startDate,
      this.price = vacation.price,
      this.followers = vacation.followers,
      this.userId =  vacation.userId;
      this.followedVacation = vacation.followedVacation
     
    }

        // Create schema for POST: 
        private static schemaPost = Joi.object({
          vacationId: Joi.forbidden(),
          description: Joi.string().required().min(2).max(1000),
          location: Joi.string().required().min(2).max(500),
          image: Joi.object().optional(),
          imageName: Joi.string().optional().min(2).max(500),
          startDate: Joi.string().required(),
          endDate: Joi.string().required(),
          price: Joi.number().required(),
          followers: Joi.forbidden(),
          userId: Joi.optional(),
          followedVacation: Joi.optional()
      });
  
      // Validate post request: 
      public validatePost(): string {
  
          // Validate current object: 
          const result = VacationModel.schemaPost.validate(this, { abortEarly: false });
  
          // Return error message if validate failed or undefined if validate succeeds: 
          return result.error?.message;
      }
  
      // Create schema for PUT: 
      private static schemaPut = Joi.object({
        vacationId: Joi.optional(),
        description: Joi.string().required().min(2).max(1000),
        location: Joi.string().required().min(2).max(500),
        image: Joi.object().optional(),
        imageName: Joi.string().optional().min(2).max(500),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        price: Joi.number().required(),
        followers: Joi.forbidden(),
        userId: Joi.optional(),
        followedVacation: Joi.optional()
      });
  
      // Validate put request: 
      public validatePut(): string {
  
          // Validate current object: 
          const result = VacationModel.schemaPut.validate(this);
  
          // Return error message if validate failed or undefined if validate succeeds: 
          return result.error?.message;
      }
}

export default VacationModel;