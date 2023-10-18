import {UserController} from "../controller/UserController";
import {body, param} from "express-validator";

export const userRoutes = [
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "list",
        validation: [],
    },
    {
        method: "get",
        route: "/users/search",
        controller: UserController,
        action: "searchByName",
        validation: []
    },
    {
        method: "get",
        route: "/users/email",
        controller: UserController,
        action: "getByEmail",
        validation: []
    }
    ,{
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one",
        validation: [
            param('id').isInt()
        ]
    }
    ,{
        method: "post",
        route: "/users",
        controller: UserController,
        action: "create",
        validation: [
            body('name').isString(),
            body('email').isEmail(),
        ],
    }
    ,{
        method: "patch",
        route: "/users/status",
        controller: UserController,
        action: "updateStatus",
        validation: [
            body('ids').isArray({
                max: 10
            }),
            // Validate each array element
            body('statuses').custom(values => !values.some((val) => !['ACTIVE', 'BLOCKED', 'PENDING'].includes(val)))
        ]
    }
    ,{
        method: "patch",
        route: "/users/group/add",
        controller: UserController,
        action: "addToGroup",
        validation: []
    }
    ,{
        method: "patch",
        route: "/users/group/remove",
        controller: UserController,
        action: "removeFromGroup",
        validation: [
            body('id').isInt()
        ]
    }
    ,{
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove",
        validation: [
            param('id').isInt()
        ]
    }
]