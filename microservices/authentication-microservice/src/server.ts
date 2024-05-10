import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { appDataSource } from "./config/dbConfig";
import router from "./routes/router";

dotenv.config({ path: ".env" });

const app: Express = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://192.168.29.74:5173",
            "http://192.168.29.8:5173",
            "http://192.168.29.165:5173"
        ],
        methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: true }));

app.use("/static", (req, res, next) => {
    // Set the desired response headers
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); 
    // Call next() to pass control to the next middleware or route handler
    next();
});
app.use("/static", express.static("static"));

app.use(router);
const connectWithDatabase = async () => {
    console.log("Connecting with mysql database . . . ");
    try {
        const mysqlConnection = await appDataSource.initialize();
        console.log("Connected with mysql database . . . ");
        return mysqlConnection;
    } catch (error) {
        console.log(error);
        console.log("Error while connecting with mysql database . . . ");
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
};

const accessDB = connectWithDatabase();

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});


export default accessDB;