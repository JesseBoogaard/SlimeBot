const SlimeDB = require('./db.js');
const ranch = new SlimeDB();
const availableSlimes = require('./Data/Slimes.json');
const food = require('./Data/Foods.json');
let newPlorts = 0
class Functions {
    constructor() {

    }
    // begin of ranch functions
    doesRanchExist(serverID) {
        return new Promise((fulfill, reject) => {
            ranch.doesRanchExist(serverID).then((res) => {
                fulfill(res)
            }, reject)
        })
    }

    addRanchToDB(ranchName, serverID) {
        return new Promise((fulfill, reject) => {
            ranch.addRanchToDB(ranchName, serverID).then((res) => {
                fulfill(res)
            }, reject)
        })
    }

    getRanchInfo(serverID) {
        return new Promise((fulfill, reject) => {
            ranch.getRanchInfo(serverID).then((res) => {
                fulfill(res)
            }, reject)
        })
    }

    resetRanch(serverID, newName) {
        return new Promise((fulfill, reject) => {
            ranch.resetRanch(serverID, newName).then((res) => {
                if (res) {
                    fulfill(res)
                } else {
                    reject(res)
                }
            })
        })
    }
    // end of ranch functions
    // begin of slime functions
    getSlimeInfo(slimeName) {
        return new Promise((fulfill, reject) => {
            let requestedSlime = slimeName.toLowerCase()
            for (let i = 0; i < Object.keys(availableSlimes).length; i++) {
                if (availableSlimes[i].name.toLowerCase() == requestedSlime) {
                    requestedSlime = availableSlimes[i]
                    fulfill(requestedSlime);
                }
            }
        })
    }

    getSlimeInfoForRanch(res) {
        return new Promise((fulfill, reject) => {
            let str = `**Slimes:** \n\n`;
            res.forEach((slime) => {
                if (slime.amount > 0) {
                    str = str + `${ slime.slimeName }s: ${ slime.amount }\n`;
                }
            }, reject());
            fulfill(str);
        })
    }

    getRandomSlime(serverID) {
        return new Promise((fulfill, reject) => {
            let randomKey = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let newSlime = availableSlimes[randomKey]
            ranch.registerNewSlime(serverID, newSlime).then((res) => {
                if (res) {
                    fulfill(newSlime);
                }
            }, reject)
        })
    }

    getPlorts(serverID) {
        return new Promise((fulfill, reject) => {
            ranch.getPlorts(serverID).then((res) => {
                let str = `**Plorts:** \n\n`
                res.forEach((slime) => {
                    if (slime.plorts > 0) {
                        str = str + `${ slime.plorts } ${ slime.slimeName } plorts \n`
                    }
                })
                fulfill(str);
            }, reject())
        })
    }
    // end of slime functions
    // begin of food functions
    getFoodInfo(){
        return new Promise((fulfill, reject) => {
            let foods = [];
                for (let i = 0; i < Object.keys(food).length; i++) {
                    foods.push(food[i].name);
                }
                if(foods != []){
                    fulfill(foods);
                }else{
                    reject();
                }
        })
    }
    // end of food functions
}

module.exports = Functions;