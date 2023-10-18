import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import {validationResult} from "express-validator";
import {User} from "./entity/User";
import {Group} from "./entity/Group";

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route,
            ...route.validation,
            async (req: Request, res: Response, next: Function) => {
            try {
                // Validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()})
                }

                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
            } catch (err) {
                next(err)
            }
        })
    })

    app.use((err: any, req: Request, res: Response, next: Function) => res.status(err.statusCode || 500).send({ message: err.message }));
    // start express server
    app.listen(3000)

    // insert new user and group for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         name: "Lasha",
    //         email: "avoup.g@gmail.com"
    //     })
    // )
    //
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(Group, {
    //         name: "Admins",
    //     })
    // )

    console.log("Express server has started on port 3000")

}).catch(error => console.log(error))
