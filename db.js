const sqlite3 = require('sqlite3').verbose();
const admin = require("firebase-admin");
const startingCash = 1000;
const slimeDefaults = require("./Data/slimeDefault.json");
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

    doesRanchExist(ID){
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
            this.doesRanchExist(ID).then((res) => {
                if(!res){
                    db.collection('ranches').doc(ID)
                    .set({
                        money: startingCash,
                        ranchName: ranchName,
                        plorts: [],
                        slimes: slimeDefaults,
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

    registerNewSlime(slimeName, serverID){
        return new Promise((fulfill, reject) => {
            this._slimeInRanch(slimeName, serverID).then((res) =>{
                if(res != []){
                    fulfill(this._addSlime(res, serverID));
                }else if(!res){
                    return new Promise((fulfill, reject) => {

                    })
                }
            }, reject)
        })
    }

    _slimeInRanch(slimeName, serverID){
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(serverID).get().then(doc => {
                if(!doc.exists){
                    fulfill(false);
                }else{
                    let slime = doc.data().slimes.filter(slime => slime.amount != 0 && slime.slimeName == slimeName.toLowerCase());
                    if(slime != []){
                        fulfill(slime);
                    }
                }
            }, reject)
        })
    }
    
    _addSlime(slimeData, serverID){
        return new Promise((fulfill, reject) => {
            fulfill(db.collection('ranches').doc(serverID).update({} ));
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
}

module.exports = SlimeDB;