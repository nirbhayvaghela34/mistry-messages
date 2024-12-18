import mongoose from "mongoose";

type connctionObject = {
    isconnected? : number
}

const connection: connctionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isconnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isconnected = db.connections[0].readyState;

        console.log("Database connected Successfully.");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect;