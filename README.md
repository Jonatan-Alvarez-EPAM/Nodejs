
# Nodejs
NodeJs mentoring program 2020

### Server start up:
`npm run start`

## API
### USER
- Get user info:
  - **Method:** GET
  - **Params:** userId
  - **Example:** ``http://localhost:3000/user/USER_ID``
  
- Create user:
  - **Method:** POST
  - **Payload:** ``{ id:string, login:string, password:string, age:number, isDeleted:boolean}``
  - **Example:** ``http://localhost:3000/user/``
  
- Update user:
  - **Method:** PUT
  - **Payload:** ``{ id:string, login:string, password:string, age:number, isDeleted:boolean}``
  - **Example:** ``http://localhost:3000/user/``
  
- Delete user:
  - **Method:** DELETE
  - **Query params:** id
  - **Example:** ``http://localhost:3000/user?id=USER_ID``
  
- Suggest list of users:
  - **Method:** GET
  - **Query params:** loginSubstring, limit
  - **Example:** ``http://localhost:3000/user/AutoSuggestUsers?loginSubstring=CAT&limit=5``
  
- Add users in a group:
  - **Method:** POST
  - **Payload:** ``{ userIds:string[], groupId:string}``
  - **Example:** ``http://localhost:3000/user/addUsersToGroup``

### GROUP
- Get group info:
  - **Method:** GET
  - **Params:** groupId
  - **Example:** ``http://localhost:3000/group/GROUP_ID``
  
- Create group:
  - **Method:** POST
  - **Payload:** ``{ id:string, name:string, permissions:Permission[]}``
  - **Example:** ``http://localhost:3000/group/``
  
- Update group:
  - **Method:** PUT
  - **Payload:** ``{ id:string, name:string, permissions:Permission[]}``
  - **Example:** ``http://localhost:3000/group/``
  
- Delete group:
  - **Method:** DELETE
  - **Query params:** id
  - **Example:** ``http://localhost:3000/group?id=GROUP_ID``
  
- List groups:
  - **Method:** GET
  - **Example:** ``http://localhost:3000/group/listGroups``