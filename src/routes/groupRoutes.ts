import {GroupController} from "../controller/GroupController";

export const groupRoutes = [
    {
        method: "get",
        route: "/groups",
        controller: GroupController,
        action: "list",
        validation: []
    },
    {
        method: "get",
        route: "/groups/search",
        controller: GroupController,
        action: "searchByName",
        validation: []
    },
    {
        method: "post",
        route: "/groups",
        controller: GroupController,
        action: "create",
        validation: []
    }
    ,{
        method: "patch",
        route: "/groups/status",
        controller: GroupController,
        action: "updateStatus",
        validation: []
    }
    ,{
        method: "delete",
        route: "/groups/:id",
        controller: GroupController,
        action: "remove",
        validation: []
    }
]