## Table of Contents

- [Description of features](#description-of-features)
  - [LOGIN SUPERAGENT](#login-superagent)
  - [LOGIN AGENT](#login-agent)
  - [CREATE AGENT](#create-agent)
  - [UPDATE AGENT](#update-agent)
  - [DELETE AN AGENT](#delete-an-agent)
  - [DEACTIVATE AGENT](#deactivate-agent)
  - [ACTIVATE AGENT](#activate-agent)
  - [CREATE AGENT](#create-agent-1)
  - [GET ALL AGENTS](#get-all-agents)
  - [GET ALL DRIVERS](#get-all-drivers)
  - [GET SINGLE AGENT](#get-single-agent)
  - [GET SINGLE DRIVER](#get-single-driver)
  - [CREATE TRANSACTION](#create-transaction)
  - [GET ALL transactions](#get-all-transactions)
  - [GET ALL TRANSACTIONS BY EACH AGENT](#get-all-transactions-by-each-agent)
  - [GET ALL TRIPS BY A DRIVER](#get-all-trips-by-a-driver)

## Vision

IGRP is an application that aids transport community carry out their daily tranasction and charges for different vehicles.

## Setup

### Dependencies

list of libraries, tools, and technologies used.

- [express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [Node.js](https://nodejs.org/en/) - A JavaScript runtime environment
- [MongoDB](https://mlab.com/) - For database services
- A package manager - [[NPM](https://www.npmjs.com/)

### Getting Started

- clone the repo - `https://github.com/DinmaOtutu/igrp-transports.git`
- Navigate to the project directory and open on any editor, VS Code preferably.
- Install the project dependencies by running `npm Install`
- After installation, to start the server run `npm start`

# Description of features

## LOGIN SUPERAGENT

A superagent has been automatically created, to login get the phone number and password from the authorized person or check the environment variable.
To get to this endpoint, provide the phone number and password

```
POST REQUEST
{
    "phoneNumber" : "superagent number",
    "password" : "superagent password"
}
https://igrp-transports.herokuapp.com/api/superLogin
```

## LOGIN AGENT

Only agents created by the superagent can be permitted to login. Provide the agents phone number and the password assigned to the agent.

```
POST REQUEST
{
"phoneNumber" : "agent number",
"password" : "agent password"
}
https://igrp-transports.herokuapp.com/api/loginAgent
```

## CREATE AGENT

Only super agents are permitted to create agents. To create an agent, the following are provided but only phone number is compulsory.

```
POST REQUEST
{
"phoneNumber": "agent number",
"password": "agent password",
"fullname": "agent name",
"address": "agent address",
"bvn": "agent bvn",
"nimc": "agent NIMC",
"driversLicense": "agent licence",
"email"agent email",
"age": "agentage",
"imenumber": "agent imei-number"
}
https://igrp-transports.herokuapp.com/api/createAgent
```

## UPDATE AGENT

Only superagent can update the details of an agent. To perform this action, provide the details you want to update.
`Note: You must not provide all the details, just provide the ones that need update.`

```
PATCH REQUEST
{
"phoneNumber": "agent number",
"password": "agent password",
"fullname": "agent name",
"address": "agent address",
"bvn": "agent bvn",
"nimc": "agent NIMC",
"driversLicense": "agent licence",
"email"agent email",
"age": "agentage",
"imenumber": "agent imei-number"
}
https://igrp-transports.herokuapp.com/api/updateAgent
```

## DELETE AN AGENT

Only a superagent can delete an agent, to delete an agent, the PHONE NUMBER is sent:

```
DELETE REQUEST
{
    "phoneNumber" : "agent number"
}
https://igrp-transports.herokuapp.com/api/deleteAgent
```

## DEACTIVATE AGENT

Only a super admin can deactivate an agent, by deactivating this agent, the user cannot have access to login or perform any transaction on the app.

```
PATCH REQUEST
{
    "phoneNumber": "agent number"
}
https://igrp-transports.herokuapp.com/api/deactivate
```

## ACTIVATE AGENT

When a superagent wants to activate an agent after deactivating the agent, to achieve that this endpoint is accessed

```
PATCH REQUEST
{
    "phoneNumber": "agent number"
}
https://igrp-transports.herokuapp.com/api/activate
```

## CREATE DRIVER

A super agent can create a driver, only drivers created by the super admin can carry out transactions on the application.
`Availabe vehicle types are tipper1 (N250), tipper2(500), tipper3(1000)`
`The vehicle number is a unique serial number assigned to each vehicle, 4digits and it starts with 0001`
```
POST REQUEST
{
            "phoneNumber": "driver number"
            "vehicleType": "vehicle type"
            "vehicleNumber": "vehicleNumber
            "fullname": "driver name"
            "driversLicence": "driversLicence",
            "password": "password"
            "plateNumber":"vehicle plateNumber"
}
https://igrp-transports.herokuapp.com/api/createDriver
vehicleType: {type: String, enum: ["tipper",
"taxi", "keke", "okada"]}
```

## GET ALL AGENTS

We can access all agents using this endpoint
```
GET REQUEST

https://igrp-transports.herokuapp.com/api/agents
```


## GET ALL DRIVERS

We can access all drivers using this endpoint
```
GET REQUEST

https://igrp-transports.herokuapp.com/api/drivers
```

## GET SINGLE AGENT
We can get a single agent:
```
GET REQUEST
https://igrp-transports.herokuapp.com/api/singleAgent/{agent's Number}
```

## GET SINGLE DRIVER
We can get a single driver:
```
GET REQUEST
https://igrp-transports.herokuapp.com/api/singleDriver/{driver's Number}
```

## CREATE TRANSACTION
Only logged in agents can make transactions on this application
```
POST REQUEST
{
"phoneNumber": "agent number",
"vehicleType": "vehicle type",
"tipperPrice": "price either 350, 500 or 1000",
"vehicleNumber": "unique vehicle number"
}
https://igrp-transports.herokuapp.com/api/createTransaction
```
## GET ALL transactions
To get all the transactions carried out on the application
```
GET REQUEST
https://igrp-transports.herokuapp.com/api/transactions
```
## GET ALL TRANSACTIONS BY EACH AGENT
We can get the transactions carried out by each agent
```
GET REQUEST
https://igrp-transports.herokuapp.com/api/agentTransaction/{agent's Number}
```
## GET ALL TRIPS BY A DRIVER
We can get the transactions carried out by each agent
```
GET REQUEST
https://igrp-transports.herokuapp.com/apidriverTransaction/{drivers's Number}
```

## AUTHOR
- Yours truly DinmaOtutu

## App Hosted
`https://igrp-transport.herokuapp.com/api`