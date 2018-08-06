# Pharmeasy Task

Restful API in node.js, mongoDB.
All Post request should be in JSON format.

### Installation

Install the dependencies and start the server.

```sh
$ cd pharmist
$ npm install
$ npm start
```

### Usage Example:
#####  { Create User }
API to create new User. If already exists then error is thrown
###### Required Param : [name, email, password, confirmPass, ,mobile, gender, role]
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
    "gender": "Male", 
    "role": "Doctor"
}
Response: {
  "msg": "User created successfully",
  "userId": "5b3b3d3057fcc813e44fb70a"
}
```
#####  { Add prescription }
API to add prescription against user.
###### Required Param : [patientEmail, doctorEmail, isApprovedByDoctor, period, medicines]
Test Cases:-
```sh
Url         : localhost:3000/api/user/prescription/create
http method : POST
Post Data  : {
    "patientEmail": "anand@gmail.com",
    "doctorEmail": "abhishek@gmail.com",
    "isApprovedByDoctor": "Y",
    "period": "3 July 2018 -  6 July 2018",
    "medicines": [
        {"name": "combiflam 400 mg", "dose": "2 Times daily"}
        ]
}
Response: {
  "msg": "Prescription added successfully",
  "id": "5b3bc3aa05dc4726f34fca42"
}
```
#####  { Get all prescription}

###### Required Param : [email]
API to get all prescription of a user.
API also return request by DOCTOR/PHARMIST against particular prescription
Test Cases:-
```sh
Url         : localhost:3000/api/user/prescription/get
http method : POST
Post Data  : {
    "email": "anand@gmail.com"
}
Response: [
  {
    "patientEmail": "anand@gmail.com",
    "doctorEmail": "abhishek@gmail.com",
    "isApprovedByDoctor": "Y",
    "duration": "3 July 2018 -  6 July 2018",
    "medicines": [
      {
        "name": "combiflam 400 mg",
        "dose": "2 Times daily"
      }
    ],
    "insertedOn": "2018-07-03T11:52:46.679Z",
    "prescriptionRequest": [
      {
        "prescriptionId": "5b3b638e44e56517f38afd1d",
        "email": "abhishek@gmail.com",
        "status": "Approve",
        "role": "DOCTOR",
        "requestOn": "2018-07-03T13:01:06.038Z",
        "requestId": "5b3b739292e8511c04587bc2"
      },
      {
        "prescriptionId": "5b3b638e44e56517f38afd1d",
        "email": "snehal@gmail.com",
        "status": "Pending",
        "role": "DOCTOR",
        "requestOn": "2018-07-03T18:24:02.626Z",
        "requestId": "5b3bbf429370e92630e1bf4e"
      }
    ],
    "prescriptionId": "5b3b638e44e56517f38afd1d"
  }
]
```
#####  {Request for accessing presciption}
###### Required Param : [email, prescriptionId]
API to ask permission to access prescription of a particular user.
Test Cases:-
```sh
Url         : localhost:3000/api/user/prescription/request
http method : POST
Post Data  : {
    "prescriptionId": "5b3b638e44e56517f38afd1d",
    "email": "snehal@gmail.com"
}
Response:{
  "msg": "Prescription request submitted successfully",
  "id": "5b3bc52d05dc4726f34fca44"
}

```
#####  {Approving request for prscription}
###### Required Param : [email, prescriptionId, requestId, status]
API to grant permission to access prescription.
Test Cases:-
```sh
Url         : localhost:3000/api/user/prescription/approve
http method : POST
Post Data  : {
        "prescriptionId": "5b3b638e44e56517f38afd1d",
        "requestId": "5b3b739292e8511c04587bc2",
        "email": "anand@gmail.com",
        "status" : "Approve"
}
Response:{
  "msg": "request updated successfully"
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
    gender      : String,
    createdOn   : timestamp
}
```
#### prescription
```sh
{
    _id             : Mongo ObjectId,
    patientEmail    : String,
    doctorEmail     : String,
    duration        : String,
    medicines       : Array,
    status          : String,
    insertedOn      : TimeStamp
}
```

#### prescriptions-request
```sh
{
    _id             : Mongo ObjectId,
    prescriptionId  : mongo ObjectId,
    email           : String,
    status          : String,
    role            : String,
    requestOn       : TimeStamp
}
```
