import mysql from "mysql";
import config from "../01-utils/config";

// Create a pool of connections for connecting to MySQL database:
const connection = mysql.createPool({
    host: config.mysql.host, // Computer name where the database exists.
    user: config.mysql.user, // Database username
    password: config.mysql.password, // Database password
    database: config.mysql.database, // Database name 
});

// sql: "SELECT * FROM Products"
function execute(sql: string, values?: any[]): Promise<any> {

    // Promisify sql access:
    return new Promise<any>((resolve, reject) => {

        // Execute SQL query:
        connection.query(sql, values, (err, result) => {

            // On error - report the error: 
            if(err) {
                reject(err);
                return;
            }

            // On success - report the return data: 
            resolve(result);
        });
    });
}

export default {
    execute
};
