const SlimeDB = require('./db.js');
const ranch = new SlimeDB();
const availableSlimes = require('./Data/Slimes.json');

class Functions{
    constructor(){

    }

    getSlimeInfo(res){
        return new Promise((fulfill, reject) => {
            let str = "**Slimes:** \n\n";
            res.forEach((slime) => {
                str = str + slime.slimeName + "s: "+ slime.amount + " \n";
            })
            fulfill(str);
        })
    }

    getRanchInfo(serverID){
        return new Promise((fulfill, reject) => {
            ranch.getRanchInfo(serverID).then((res) => {
                fulfill(res)
            }, reject)
        })
    }

    getRandomSlime(serverID){
        return new Promise((fulfill, reject) => {
            let randomKey = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let newSlime = availableSlimes[randomKey]
            ranch.registerNewSlime(serverID, newSlime).then((res) => {
                if(res){
                    fulfill(newSlime);
                }
            })
        }).catch((err) => {
            reject(err)
        })
    }
}

module.exports = Functions;