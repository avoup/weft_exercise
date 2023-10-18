import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import {Group} from "./entity/Group";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Group],
    migrations: [],
    subscribers: [],
})
