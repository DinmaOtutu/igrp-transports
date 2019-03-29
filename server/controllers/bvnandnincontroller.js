const Transaction = require("../models/Transaction");
const responses = require("../utils/responses");
const crypto = require("crypto");
const dotenv = require("dotenv");
const User = require("../models/Users.js");
const axios = require("axios");
const config = require("../config/index");


const { CLIENTKEY, COMFIRMURL, CLIENTID, NINURL } = config;



 
 class BvnandNinController {
   /**
    *@description confirms BVN of an agent
    *@static
    *@param  {Object} res - response
    *@returns {object} - null
    *@memberof TransactionController
    */

   static async confirmBvn(req, res) {
     try {
       const { bvn } = req.body;
       const clientKey = `${CLIENTKEY}`;
       const clientId = `${CLIENTID}`;
       const object = clientId + clientKey + bvn;
       const token = crypto
         .createHash("sha256")
         .update(object)
         .digest("hex");
       const makeBvnRequest = (await axios.post(`${COMFIRMURL}${bvn}`, null, {
         headers: {
           CLIENTID: `${CLIENTID}`,
           HASHTOKEN: token
         }
       })).data;
       if (makeBvnRequest && makeBvnRequest.Message === "Results Found") {
         return res.status(200).json({
           message: "Bvn Successfully confirmed",
           makeBvnRequest
         });
       } else {
         return res.status(404).json({
           message: makeBvnRequest.Message
         });
       }
     } catch (error) {
       console.log(error);
     }
   }

   /**
    *@description confirms NIN of an agent
    *@static
    *@param  {Object} res - response
    *@returns {object} - null
    *@memberof TransactionController
    */

   static async validateNin(req, res) {
       try {
           const { regNo } = req.body;
           const clientId = `${CLIENTID}`;
           const clientKey = `${CLIENTKEY}`;

           const ninObject = clientId + clientKey + regNo;

           const token = crypto
               .createHash("sha256")
               .update(ninObject)
               .digest("hex");
console.log(token);
           const ninReq = (await axios.post(`${NINURL}${regNo}`, null, {
               headers: {
                   CLIENTID: `${CLIENTID}`,
                   HASHTOKEN: token
               }
           })).data;

           if (ninReq) {
               return res.status(200).json({
                   message: "Nin Sucessfully confirmed",
                   ninReq
               });
           } else {
               res.status(404).json({
                   message: "NIN unconfirmed"
               });
           }
       } catch (error) {
           console.log(error)
       }
    
   }
 }

 module.exports = BvnandNinController;