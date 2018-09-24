const slimes = require('./Data/Slimes.json');

class Functions{
    constructor(){

    }

    getSlimeInfoByID(results){
        return new Promise((fulfill, reject) => {
            let res = [];
            this.res = res;
            for(let i = 0; i < slimes.length; i++){
                if(slimes[i].id == results.id){
                    this.res.push(slimes[i].name + results.slimeID);
                }
            }
            fulfill(res);
        })
    }

}

module.exports = Functions;