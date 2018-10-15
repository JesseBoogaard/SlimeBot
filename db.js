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

    registerNewSlime(serverID, newSlime) {
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(serverID).get().then((doc) => {
                if (doc.exists) {
                    let oldDoc = doc.data()
                    for(let slime in oldDoc.slimes) {
                        if(oldDoc.slimes[slime].slimeName == (newSlime.name).toLowerCase()) {
                            oldDoc.slimes[slime].amount += 1;
                            let newDoc = oldDoc
                            db.collection('ranches').doc(serverID).set(newDoc)
                            fulfill(true)
                        }
                    }
                }
            }, reject)
        }).catch((err) => {
            reject(err)
        })
    }

    getRanchInfo(serverID){
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(serverID).get().then(doc => {
                if(!doc.exists){
                    fulfill(false)
                }else{
                    fulfill(doc.data());
                }
            }, reject)
        })
    }
}

module.exports = SlimeDB;