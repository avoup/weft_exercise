1. Run `docker-compose up`
2. Run `npm i`
3. Run `npm start`

Routes:

Create User:
```Javascript
POST
localhost:3000/users 
  {
    "name": "some name",
    "email": "email@email.com"
  }
```

List Users
```Javascript
GET
localhost:3000/users?limit=30&page=1
```

Get User By Email:
```Javascript
GET
localhost:3000/users/email?email=mail@mail.com
```
  
Bulk update user statuses: 
```Javascript
POST
localhost:3000/users/status
{
  "ids": [1, 3, 7, 2],
  "statuses": ["BLOCKED", "BLOCKED", "BLOCKED", "BLOCKED"]
}
```

Delete groups
```javascript
DELETE
localhost:3000/groups/1
```

Delete users
```javascript
DELETE
localhost:3000/users/1
```

Add/remove user to a group
```javascript
PATCH
localhost:3000/users/add
localhost:3000/users/remove
{
    "id": 1,
    "groupId": 1
}
```

Find user by name
```javascript
localhost:3000/users/search
{
    "name": "some name"
}
```