const slimes = require('./Data/Slimes.json');

class Functions{
    constructor(){

    }

    getSlimeInfoByID(results){
        let slimeInfo = [];
        return new Promise((fulfill, reject) => {
            for(let i = 0; i < results.length; i++){
                slimeInfo.push({ "name": slimes.filter(slime => slime.id == results[i].slimeID)[0].name, "amount": results[i].amount })
            }
            fulfill(slimeInfo);
        })
    }

}

module.exports = Functions;