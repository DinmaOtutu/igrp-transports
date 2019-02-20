## Table of Contents

- [Description of features](#description-of-features)
  - [LOGIN SUPERAGENT](#login-superagent)
  - [LOGIN AGENT](#login-agent)
  - [CREATE AGENT](#create-agent)
  - [UPDATE AGENT](#update-agent)
  - [DELETE AN AGENT](#delete-an-agent)
  - [DEACTIVATE AGENT](#deactivate-agent)
  - [ACTIVATE AGENT](#activate-agent)

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

