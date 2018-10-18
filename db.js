const admin = require("firebase-admin");
const startingCash = 1000;
const slimeDefaults = require("./Data/slimeDefault.json");
let ranches;
let db;
let oldDoc;
let plorts = 0;
require('dotenv').config();

class SlimeDB{
    constructor(){
        let serviceAccount = require(process.env.SERVICEACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://slimebot-01.firebaseio.com"
        });
        db = admin.firestore();
        ranches = db.collection('ranches')
        console.log("connected to db");
    }
// start ranch functions
    doesRanchExist(serverID){
        return new Promise((fulfill, reject) => {
            ranches.doc(serverID).get().then((doc) => {
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

    resetRanch(serverID, newName){
        return new Promise((fulfill, reject) => {
            ranches.doc(serverID).set({
                money: startingCash,
                ranchName: newName,
                slimes: slimeDefaults,
                foods: []
            }).then(() => {
                fulfill(true);
            }, reject)
        })
    }

    addRanchToDB(ranchName, serverID){
        return new Promise((fulfill, reject) => {
            this.doesRanchExist(serverID).then((res) => {
                if(!res){
                    db.collection('ranches').doc(serverID)
                    .set({
                        money: startingCash,
                        ranchName: ranchName,
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
// end ranch functions
// start slime functions
    registerNewSlime(serverID, newSlime) {
        return new Promise((fulfill, reject) => {
            this._cloneRanch(serverID).then((doc) => {
                if(doc != undefined) {
                    for(let slime in doc.slimes) {
                        if(doc.slimes[slime].slimeName == (newSlime.name).toLowerCase()) {
                            doc.slimes[slime].amount += 1;
                            let newDoc = doc;
                            this._overWriteRemote(serverID, newDoc).then((res) => {
                                if(res){
                                    fulfill(res)
                                }
                            })
                        }
                    }
                }
            }, reject)
        }).catch((err) => {
            reject(err)
        })
    }

    getPlorts(serverID){
        return new Promise((fulfill, reject) => {
            let newDoc;
            console.log(newDoc)
            this._cloneRanch(serverID).then((doc) => {
                for(let i = 0; i < doc.slimes.length; i++){
                    doc.slimes[i].plorts += Math.floor(Math.random() * Math.floor(doc.slimes[i].amount))
                    newDoc = doc;
                }
                    this._overWriteRemote(serverID, newDoc).then((res) => {
                        if(res){
                            fulfill(newDoc.slimes)
                        }
                    })
            }, reject)
        })
    }
// end slime functions
// private functions
    _overWriteRemote(serverID, newDoc){
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(serverID).set(newDoc).then((res) => {
                fulfill(true)
            }, reject)
        })
    }

    _cloneRanch(serverID){
        return new Promise((fulfill, reject) => {
            db.collection('ranches').doc(serverID).get().then((doc) => {
                if(doc.exists){
                    oldDoc = doc.data()
                    fulfill(oldDoc)
                }
            }, reject)
        })
    }
}

module.exports = SlimeDB;