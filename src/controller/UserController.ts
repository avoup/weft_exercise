import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"
import {getConnection, In, Like} from "typeorm";
import {Group} from "../entity/Group";
import {GroupStatusEnum} from "../entity/enums/group";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)
    private groupRepository = AppDataSource.getRepository(Group)

    // Create
    async create(request: Request, response: Response, next: NextFunction) {
        const { name, email } = request.body;

        const user = Object.assign(new User(), {
            name,
            email,
        })

        return this.userRepository.save(user)
    }

    // Read
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                group: true
            }
        })

        if (!user) {
            throw new Error('User does not exist')
        }
        return user
    }

    async list(request: Request, response: Response, next: NextFunction) {
        const page = Number(request.query.page || 1)
        const limit = Number(request.query.limit || 10)

        const [result, total] = await this.userRepository.findAndCount(
            {
                // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
                take: limit,
                skip: (page-1)*limit
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

        const [result, total] = await this.userRepository.findAndCount(
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

    async getByEmail(request: Request, response: Response, next: NextFunction) {
        const email = String(request.query.email)

        const user = await this.userRepository.findOne({
            where: { email },
            relations: {
                group: true,
            },
        });

        if (!user) {
            throw new Error('User does not exist')
        }
        return user
    }

    // Update
    async updateStatus(request: Request, response: Response, next: NextFunction) {
        const { ids, statuses } = request.body;

        // Use raw query to update batch
        let query = ids.reduce((acc, id, idx) =>
            `${acc} WHEN ${id} THEN '${statuses[idx]}'`, `UPDATE "user" SET status = CASE id `
        )
        query += ` END WHERE id IN (${ids.join(', ')})`

        return await AppDataSource.query(query)
    }

    async addToGroup(request: Request, response: Response, next: NextFunction) {
        const { id, groupId } = request.body;

        await this.groupRepository.save({
            id: groupId, status: GroupStatusEnum.NOT_EMPTY
        })

        const group = new Group();
        group.id = groupId;
        group.status = GroupStatusEnum.NOT_EMPTY;

        return this.userRepository.save({ id, group });
    }

    async removeFromGroup(request: Request, response: Response, next: NextFunction) {
        const { id, groupId } = request.body;

        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: {
                users: true,
            }
        })

        // If user is last one, update group status
        if (group.users.length >= 1) await this.groupRepository.save({
            ...group, status: GroupStatusEnum.EMPTY,
        })

        return this.userRepository.save({ id, group: null })
    }

    // Delete
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}