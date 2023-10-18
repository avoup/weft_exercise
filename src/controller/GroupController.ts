import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {Equal, Like} from "typeorm";
import {Group} from "../entity/Group";

export class GroupController {

    private groupRepository = AppDataSource.getRepository(Group)

    // Create
    async create(request: Request, response: Response, next: NextFunction) {
        const { name } = request.body;

        const group = Object.assign(new Group(), {
            name,
        })

        return this.groupRepository.save(group)
    }

    // Read
    async list(request: Request, response: Response, next: NextFunction) {
        const page = Number(request.query.page || 1)
        const limit = Number(request.query.limit || 10)

        const [result, total] = await this.groupRepository.findAndCount(
            {
                // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
                take: limit,
                skip: (page-1)*limit,
                relations: {
                    users: true,
                },
            }
        );

        return {
            data: result,
            count: total
        }
    }

    async searchByName(request: Request, response: Response, next: NextFunction) {
        const page = Number(request.query.page || 1)
        const limit = Number(request.query.limit || 10)
        const name = String(request.query.name)

        const [result, total] = await this.groupRepository.findAndCount(
            {
                where: { name: Like('%' + name + '%') }, order: { name: "DESC" },
                take: limit,
                skip: (page-1)*limit
            }
        );

        return {
            data: result,
            count: total
        }
    }

    // Update
    async updateStatus(request: Request, response: Response, next: NextFunction) {
        const { id, status } = request.body;

        return this.groupRepository.save({ id, status })
    }

    // Delete
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let groupToRemove = await this.groupRepository.findOneBy({ id })

        if (!groupToRemove) {
            throw new Error('Group does not exist')
        }

        return await this.groupRepository.remove(groupToRemove)
    }

}