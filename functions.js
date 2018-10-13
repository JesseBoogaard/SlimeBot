const slimes = require('./Data/Slimes.json');
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
        }, reject)
    }

    getRandomSlime(){
        console.log(1)
        return new Promise((fulfill, reject) => {
            console.log(2)
            let randomKey = Object.keys(availableSlimes)[Math.floor(Math.random() * Object.keys(availableSlimes).length)]
            let newSlime = availableSlimes[randomKey]
            fulfill(newSlime);
        })
    }
}

module.exports = Functions;