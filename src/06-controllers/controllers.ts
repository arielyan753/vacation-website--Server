import express, { NextFunction, Request, Response } from "express";
import logic from "../05-logic/logic";
import path from 'path';
import FollowersModel from "../03-models/followersModel";
import VacationModel from "../03-models/vacationModel";
import verifyLoggedIn from "../02-middleware/verifyLogin";
import verifyIfAdmin from "../02-middleware/checkIfAdmin";

const router = express.Router();

router.get("/vacations/:userId",verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const vacations = await logic.getAllVacations(userId);
        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

router.get('/vacations/images/:imageName', async (request, response, next: NextFunction) => {
    try{
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageName);
        response.sendFile(absolutePath);

    }
    catch(err:any){
        next(err);
    }
    
});

router.post("/followers",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        const follow = new FollowersModel(request.body);
        console.log(follow);
        const addedFollower = await logic.addFollower(follow);
        response.status(201).json(addedFollower);
    }
    catch (err: any) {
        next(err);
    }
});

router.post('/vacations/',verifyIfAdmin, async (request, response, next: NextFunction) => {
    try{
        request.body.image = request.files?.image;
        const vacationToAdd = new VacationModel(request.body);
        const addedVacation = await logic.addVacation(vacationToAdd);
        response.status(201).json(addedVacation);
    }
    catch(err:any){
        next(err);
    }
    
});

router.put('/vacations/:id', async (request, response, next: NextFunction) => {
    try{
        request.body.image = request.files?.image;
        const id = +request.params.id;
        request.body.vacationId = id;
        const vacation = new VacationModel(request.body);
        const updatedVacation = await logic.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch(err:any){
        next(err);
    }
    
});

router.delete("/vacations/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        await logic.deleteVacation(id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/followers/:userId/:vacationId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
   
        await logic.removeFollower(userId, vacationId);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;