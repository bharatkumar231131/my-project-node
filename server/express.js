import express from "express";
import cors from "cors";
import path from "path";

import STATUSCODE from './statusCode.js';
import STRINGCONST from './stringConstant.js';
import router from '../routes/index.js';
import database from "../database/init.sql.js"
import bodyParser from 'body-parser';
// import { insertUserData } from "../service/user.service.js";


const {Auth,Product,Section,Category,Banner,Wishlist,Cart,Order,Payfast,Delivery } = router;

export const initExpress = () => {
    const app = express();

    app.set('view engine','ejs');
    app.set('views', './views');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(cors({ origin: "*" }));


    const __dirname = path.resolve();
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.post('/testing-uploading-file', async (req, res, next) => {
        try {
            const result = await UploadFile(req, 'testing');
            res.status(201).json({ result });
        } catch (error) {
            next(error);
        }
    })

    // app.get("/Aw001", async (req, res, next) => {
    //     res.json({
    //         service: "ecommers",
    //         status: "running"
    //     });
    // });

    app.use("/AW0001/api/v1/",Auth);
    app.use("/AW0001/api/v1/",Product);
    app.use("/AW0001/api/v1/",Section);
    app.use("/AW0001/api/v1/",Category);
    app.use("/AW0001/api/v1/",Banner);
    app.use("/AW0001/api/v1/",Wishlist);
    app.use("/AW0001/api/v1/",Cart);
    app.use("/AW0001/api/v1/",Order);
    app.use("/AW0001/api/v1/",Payfast);
    app.use("/AW0001/api/v1/",Delivery);
    
    app.use((error, req, res, next) => {
        console.log(error);
        console.error('API :- ', req.url);
        const message = error.message;
        let statusCode = error.statusCode || STATUSCODE.SERVER_ERROR;
        if (error.name === 'TokenExpiredError') {
            statusCode = STATUSCODE.UNAUTHORIZED;
        }
        return res.status(statusCode).json({ message, statusCode, status: false });
    });

    app.listen(process.env.PORT, async () => {
        console.info(STRINGCONST.CONNECTED);
    });
    database.sync({ alter: false })
        .then(async () => {
            console.info(STRINGCONST.DATABASE_CONNECTION_MESSAGE);
            // await insertUserData();
        })
        .catch(err => console.error(err));
}