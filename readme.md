# HManagement Task

Restful API in node.js, mongoDB.
All Post request should be in JSON format.

### Installation

Install the dependencies and start the server.

```sh
$ cd hManagement
$ npm install
$ npm start
```

### Usage Example:
###   Add User
API to Add new User. If already exists then error is thrown
###### Required Param : [name, email, password, confirmPass, mobile, role]
Test Cases:-
```sh
Url         : localhost:3000/api/user/register
http method : POST
Post Data  : {
    "name": "Abhishek",
    "email": "abhishek@gmail.com",
    "password": "223456",
    "confirmPass": "223456",
    "mobile": "9056300608",
    "role": "Staff"
}
Response: {
  "msg": "User created successfully",
  "userId": "5b3b3d3057fcc813e44fb70a"
}
```
###   Update User
API to Update User detail. If no user is found then error is thrown
###### Required Param : [name, password, confirmPass, mobile]
Test Cases:-
```sh
Url         : localhost:3000/api/user/update/{USER ID}
http method : PATCH
Post Data  : {
    "name": "Test",
    "password": "223456",
    "confirmPass": "223456",
    "mobile": "9056300608"
}
Response: {
  "msg": "User Updated successfully"
}
```
###   Remove User
API to Remove User.
###### Required Param : [userId]
Test Cases:-
```sh
Url         : localhost:3000/api/user/remove
http method : DELETE
Post Data  : {
	"userId": "5b67fd1d0902db04b098c7e0"
}
Response: {
  "msg": "User deleted successfully"
}
```

###   Add Hotel
API to add new hotel. Hotel will not be created with role=USER
###### Required Param : [name, description, address, totalRooms, noOfFloors, noOfRoomPerFloor, userId]
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/addhotel
http method : POST
Post Data  : {
    "name": "peninsula",
    "description": "Afee",
    "address": "Andheri" ,
    "userId": "5b67fd1d0902db04b098c7e0",
    "totalRooms": 6,
    "noOfFloors": 3,
    "noOfRoomPerFloor": 2
}
Response: {
    "msg": "Hotel added successfully",
    "id": "5b696cbd7340cb18f4844d58"
}
```
###  Update Hotel

###### Required Param : [hotelId]
API to update hotel detail based on hotelid.
API also return request by DOCTOR/PHARMIST against particular prescription
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/{HOTELID}
http method : PATCH
Post Data  : {
    "name": "grand peninsula",
    "description": "Afee",
    "userId" : "5b6945b04f724313ec74483a"
}
Response: {
    "msg": "Hotel Detail updated successfully",
    "hotelId": "5b696cbd7340cb18f4844d58"
}
```
### Remove hotel
###### Required Param : [hotelId, userId]
API to remove hotel. Once hotel is removed rooms associated wiith following hotel is removed.
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/remove
http method : DELETE
Post Data  : {
	"hotelId": "5b683779cbb7ba0812e78373",
	"userId": "5b6945b04f724313ec74483a"
}
Response:{
    "msg": "Hotel removed successfully"
}

```
### Add Rooms
###### Required Param : [userId, hotelId, type, floorNo, price, beds, maxOccupancy, roomNo]
API to add rooms againsts hotel.
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/addrooms
http method : POST
Post Data  : {
    "hotelId": "5b684eb4e99d5a0b5764e31c",
    "userId": "5b6945b04f724313ec74483a",
    "type": "villa",
    "floorNo": 2,
    "price": 6000,
    "beds" : 6,
    "maxOccupancy": 8,
    "roomNo": 2002
}
Response:{
    "msg": "rooms added successfully",
    "id": "5b6945ef4f724313ec74483c"
}

```
### Get Rooms
###### Required Param : [userId, hotelId, type, floorNo, price, beds, maxOccupancy, roomNo]
API to get rooms againsts following filter [hotelId, {from,to Date}, type, price, beds ]
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/getrooms
http method : POST
Post Data  : {
	"fromDate": "2018-08-11",
	"toDate" : "2018-08-13"
}
Response:[
    {
        "roomNo": 3001,
        "type": "deluxe",
        "floorNo": 3,
        "price": 2000,
        "beds": 2,
        "maxOccupancy": 2,
        "roomId": "5b6945cc4f724313ec74483b"
    },
    {
        "roomNo": 2002,
        "type": "villa",
        "floorNo": 2,
        "price": 6000,
        "beds": 6,
        "maxOccupancy": 8,
        "roomId": "5b6945ef4f724313ec74483c"
    }
]

```
### Book Room
###### Required Param : [userId, roomId, fromDate, toDate]
API to book room.
API check for user is authorised to use the api or not.
API check for room exists or not against id.
API check for room is available in following date range or not.
Test Cases:-
```sh
Url         : localhost:3000/api/hotel/book
http method : POST
Post Data  : {
	"userId" : "5b6945b04f724313ec74483a",
	"roomId": "5b6945ef4f724313ec74483c",
	"fromDate": "2018-08-11",
	"toDate" : "2018-08-13"
}
Response:{
    "msg": "rooms booked successfully"
}
```
### Database Schema:
#### users
```sh
{
    _id         : Mongo ObjectId,
    name        : String,
    email       : String, // unique
    mobile      : number,
    password    : String,
    role        : String,
    createdOn   : timestamp
}
```
#### hotels
```sh
{
    _id             : Mongo ObjectId,
    name            : String,
    description     : String,
    address         : String,
    totalRooms      : number,
    insertedOn      : timestamp
}
```

#### rooms
```sh
{
   _id            : Mongo ObjectId,
    hotelId       : Mongo ObjectId,
    roomNo        : number,
    type          : String,
    floorNo       : number,
    price         : number,
    beds          : number,
    maxOccupancy  : number,
    status        : String,
    reserved      : Array,
    insertedOn    : timestamp
}
```
#### bookinghistory
```sh
{
    _id     : Mongo ObjectId,
    userId : Mongo ObjectId,
    roomId : Mongo ObjectId,
    bookingDate : {
        from : timestamp,
        to   : timestamp
    },
    insertedOn : timestamp
}
```
