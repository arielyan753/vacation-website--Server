import dal from "../04-dal/dal";
import CredentialsModel from "../03-models/credentials";
import ErrorModel from "../03-models/error-model";
import RoleModel from "../03-models/role-model";
import UserModel from "../03-models/user-model";
import cyber from "../01-utils/cyber";
import { OkPacket } from 'mysql';

async function register(user: UserModel): Promise<string> {

    // Validation...
    const error = user.validateUser();
    if(error){
        throw new ErrorModel(400, error);
    }

    // Test if username already taken:
    const isTaken = await isUsernameTaken(user.username);
    if (isTaken) {
        throw new ErrorModel(400, `Username ${user.username} already taken`);
    }

    // Hash password before entering to database:
    user.password = cyber.hash(user.password);

    // sql:
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)";

    // Save:
    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password, RoleModel.User]);

    // ID:
    user.role = RoleModel.User;

    const userAfterDb = await getUserID(user.username, user.password);

    user.userId = userAfterDb.userId;

    // Remove password:
    delete user.password;


    // Token:
    const token = cyber.getNewToken(user);

    // Return:
    return token;
};

    async function getUserID(username, password) {
        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const userAfterDb = await dal.execute(sql, [username, password]);
        return userAfterDb[0]
    }


async function login(credentials: CredentialsModel): Promise<string> {

    // Validation...
    const error = credentials.validateCredential();
    if(error){
        throw new ErrorModel(400, error);
    }

    // Hash password before comparing to database:
    credentials.password = cyber.hash(credentials.password);
    
    // sql:
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

    // Execute
    const users = await dal.execute(sql, [credentials.username, credentials.password]);

    // If not exists:
    if (users.length === 0) {
        throw new ErrorModel(401, "Incorrect username or password");
    }

    // Get user:
    const user = users[0];

    // Remove password:
    delete user.password;

    // Token:
    const token = cyber.getNewToken(user);

    // Return:
    return token;
}

async function isUsernameTaken(username: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM users WHERE username = '${username}'`;
    const table = await dal.execute(sql);
    const row = table[0];
    const count = row.count;
    return count > 0;
}

export default {
    register,
    login
}
