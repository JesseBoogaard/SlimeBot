const sqlite3 = require('sqlite3').verbose();
const admin = require("firebase-admin");
const startingCash = 1000;
let db;
require('dotenv').config();
class SlimeDB{
    constructor(){
        let serviceAccount = require(process.env.SERVICEACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://slimebot-01.firebaseio.com"
        });
        db = admin.firestore();
        console.log("connected to db");
    }

    _doesRanchExist(ID){
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(ID).get().then((doc) => {
                if(!doc.exists){
                    fulfill(false)
                }else if(doc.exists){
                    fulfill(true)
                }else{
                    reject(err);
                }
            })
        })
    }

    addRanchToDB(ranchName, ID){
        return new Promise((fulfill, reject) => {
            this._doesRanchExist(ID).then((res) => {
                if(!res){
                    db.collection('ranches').doc(ID)
                    .set({
                        money: startingCash,
                        ranchName: ranchName,
                        plorts: [],
                        slimes: [],
                        foods: []
                    }).then(() => {
                        fulfill(true);
                    }, reject)
                }else{
                    fulfill(false)
                };
            })
        })
    }

    feedFoodToSlime(foodName, ID){
        return new Promise((fulfill, reject) => {
            console.log(foodName);
            let sql = `SELECT * FROM foods WHERE foodName = ${foodName} AND ranchID = ${ID}`;
            this.db.get(sql, (err, result) => {
                if(err){
                    reject(err);
                }else{
                    console.log(result);
                    fulfill(result);
                }
            })
        })
    }

    registerNewSlime(slimeID, serverID){
        return new Promise((fulfill, reject) => {
            this._slimeInRanch(slimeID, serverID).then((res) =>{
                if(res){
                    fulfill(this._addSlime(slimeID, serverID));
                }else if(res != undefined){
                    return new Promise((fulfill, reject) => {
                        let sql = `INSERT INTO slimes (slimeID, ranchID, amount) VALUES (${slimeID}, ${serverID}, 1)`;
                        this.db.run(sql, (err) => {
                            if(err){
                                reject(err);
                            }else{
                                fulfill(true);
                            }
                        })
                    })
                }
            }, reject)
        })
    }

    
    getRanchInfo(ID){
        return new Promise((fulfill, reject) => {
            let sql = `SELECT * FROM slimes WHERE ranchID = ${ID}`
            this.db.all(sql, (err, row) => {
                if(err){
                    reject(err);
                }else{
                    fulfill(row);
                }
            })
        })
    }

    _slimeInRanch(slimeID, serverID){
        return new Promise((fulfill, reject) => {
            let sql = `SELECT * FROM slimes WHERE slimeID = ${slimeID} AND ranchID = ${serverID}`;
            this.db.get(sql, (err, result) => {
                if(err){
                    reject(err);
                }else if(result != undefined){
                    fulfill(true);
                }else{
                    fulfill(false);
                }
            })
        })
    }

    _addSlime(slimeID, serverID){
        return new Promise((fulfill, reject) => {
            let sql = `UPDATE slimes SET amount = amount + 1 WHERE ranchID = ${serverID} AND slimeID = ${slimeID}`;
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                }else{
                    fulfill(true);
                }
            })
        })
    }
}

module.exports = SlimeDB;