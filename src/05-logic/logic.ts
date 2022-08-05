import { OkPacket } from "mysql";
import ErrorModel from "../03-models/error-model";
import dal from "../04-dal/dal";
import VacationModel from "../03-models/vacationModel"
import FollowersModel from "../03-models/followersModel";
import {v4 as uuid} from "uuid";
import  fs  from 'fs';
import path from 'path';


async function getAllVacations(userId: number): Promise<VacationModel[]> {
    const sql = `select a.* from vacations a, following b
    where a.vacationId = b.vacationId
    and b.userId = ?
    UNION
    select * from vacations;`;
    const vacations = await dal.execute(sql, [userId]);
    for (let i of vacations){
        const follow = await getFollowers(i.vacationId);
        if(follow){
            i.followers = follow.followers;
        }
        else{
            i.followers = 0;
        }
        
    };

    for(let i of vacations){
        const followedVacation = await checkIfFollowing(i.vacationId, userId);
        if(followedVacation){
            i.followedVacation = true;
        }
        else{
            i.followedVacation = false;
        }
    }
    return vacations;
}

async function getFollowers(vacationId: number): Promise<any> {
    const sql = "SELECT count(*) AS followers FROM following where vacationId = ? group by vacationID";
    const followers = await dal.execute(sql, [vacationId]);
    return followers[0];
}

async function checkIfFollowing(vacationId: number, userId: number): Promise<any> {
    const sql = "SELECT count(*) AS followedVacation FROM following where vacationId = ? and userId = ? group by vacationId;";
    const followedVacation = await dal.execute(sql, [vacationId, userId]);
    return followedVacation[0];
}

async function removeFollower(userId, vacationId): Promise<void> {
    const sql = "delete from following where userId = ? and vacationId = ?";
    const info: OkPacket = await dal.execute(sql, [userId, vacationId]);
    if (info.affectedRows === 0) throw new ErrorModel(404, `id ${vacationId} not found`);

}

async function addFollower(follower: FollowersModel): Promise<FollowersModel> {

    console.log(follower.userId, follower.vacationId);

    const rows = await getfollower(follower);

    console.log(rows);
    
    
    if(rows.length > 0){
        throw new ErrorModel(404, `You are already following!`);
    }
    
    const sql = "INSERT INTO following VALUES(DEFAULT, ?, ?)";

    const info: OkPacket = await dal.execute(sql, [follower.userId, follower.vacationId]);

    follower.id = info.insertId;

    return follower;
};

async function getfollower(follower){    
    const sql = "SELECT * FROM following where vacationId = ? and userId = ?"
    const followers = await dal.execute(sql, [follower.vacationId, follower.userId]);
    return followers;
}

async function addVacation(vacation:VacationModel):Promise<VacationModel>{
    const error = vacation.validatePost();
    if(error){
        throw new ErrorModel(400, error);
    }


   if(vacation.image){

    const extension =  vacation.image.name.substring(vacation.image.name.lastIndexOf('.'));
    vacation.imageName = uuid() + extension;
    await vacation.image.mv('./src/assets/images/' + vacation.imageName);
    delete vacation.image;
   }
   
   const sql = "INSERT INTO vacations VALUES (default, ?, ?, ?, ?, ?, ?)";

   const info: OkPacket = await dal.execute(sql, [vacation.description, vacation.location, vacation.imageName, vacation.startDate, vacation.endDate, vacation.price ]);

   vacation.vacationId = info.insertId;
    
    return vacation;
};


async function getOneVacation(vacationId: number): Promise<VacationModel> {
    const sql = "SELECT * FROM vacations where vacationId = ?";
    const vacation = await dal.execute(sql, [vacationId]);
    return vacation[0];
}

async function updateVacation(vacation:VacationModel):Promise<VacationModel>{
    const error = vacation.validatePut();
    if(error){
        throw new ErrorModel(400, error);
    }


    const oldVacation = await getOneVacation(vacation.vacationId);
    
    const imageInData = oldVacation.imageName;

    if(imageInData){
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageInData);
        fs.unlinkSync(absolutePath);
    }


    if(vacation.image){
        const extension =  vacation.image.name.substring(vacation.image.name.lastIndexOf('.'));
        vacation.imageName = uuid() + extension;
        await vacation.image.mv('./src/assets/images/' + vacation.imageName);
        delete vacation.image;
       }

       const sql = `UPDATE vacations SET
       description = ?,
       location = ?,
       imageName = ?,
       startDate = ?,
       endDate = ?,
       price = ?
       WHERE vacationId = ${vacation.vacationId}`;

        const info: OkPacket = await dal.execute(sql, [vacation.description, vacation.location, vacation.imageName, vacation.startDate, vacation.endDate, vacation.price]);

        if (info.affectedRows === 0) throw new ErrorModel(404, `id ${vacation.vacationId} not found`);

        return vacation;
  
};

async function deleteVacation(id: number): Promise<void> {

    const sql = "DELETE FROM vacations WHERE vacationId = ?";

    const info: OkPacket = await dal.execute(sql, [id]);

    if (info.affectedRows === 0) throw new ErrorModel(404, `id ${id} not found`);
}

export default {
    getAllVacations,
    getFollowers,
    addFollower,
    addVacation,
    updateVacation,
    deleteVacation,
    removeFollower
};
