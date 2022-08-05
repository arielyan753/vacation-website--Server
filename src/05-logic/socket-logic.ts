import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import VacationModel from "../03-models/vacationModel";
import logic from "../05-logic/logic";

function socketLogic(httpServer: HttpServer): void {

    // Create socket server:
    const socketIoServer = new SocketIoServer(httpServer, { cors: { origin: "http://localhost:3000" } });

    // socketIoServer.sockets is a collection containing all connected sockets.

    // 1. Listen to clients connections (client want to create a connection to the server):
    socketIoServer.sockets.on("connection", async (socket: Socket) => {

        console.log("Client has been connected");

        // 3. Listen to client messages:
        socket.on("msg-from-client-add", async (addedVacation :any) => {

            console.log("Client sent message: ", addedVacation);
            
            // Send back the message to all sockets:
            socketIoServer.sockets.emit<any>("msg-from-server-add", addedVacation);
        });

        socket.on("msg-from-client-update", async (updatedVacation :any) => {
            
            // Send back the message to all sockets:
            socketIoServer.sockets.emit<any>("msg-from-server-update", updatedVacation);
        });

        socket.on("msg-from-client-delete", async (deleteVacation :any) => {
            
            // Send back the message to all sockets:
            socketIoServer.sockets.emit<any>("msg-from-server-delete", deleteVacation);
        });

        // Listen to client disconnect:
        socket.on("disconnect", () => {
            console.log("Client has been disconnect");
        });

    });

}

export default socketLogic;