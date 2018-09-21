const sqlite3 = require('sqlite3').verbose();

class SlimeDB{
    constructor(){
        this.db = new sqlite3.Database("./database/sqlite.db", sqlite3.OPEN_READWRITE, (err) => {
            if(err) return console.error(err.message);
            console.log('Connected to DB successfully');
        })
    }

    addRanchToDB(ranchName, ID){
        console.log(ranchName)
        console.log(ID)
    }

    doesRanchExist(ID){
        return new Promise((fulfill, reject) => {
            let sql = `SELECT ID FROM ranches WHERE ID = ${ID}`
            this.db.get(sql, (err, result) => {
                if(err){
                    reject(err);
                }else if(result != undefined){
                    fulfill(true)
                }else{
                    fulfill(false)
                }
            })
        })
    }

    getRanchInfo(ID){
        let sql = `SELECT * FROM ranches WHERE ID = ${ID}`
        this.db.each(sql, (err, row) => {
            if(err){throw err;}
            console.log(row.ranchName);
        })
    }
}

module.exports = SlimeDB;