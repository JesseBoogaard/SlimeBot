const sqlite3 = require('sqlite3').verbose();

class SlimeDB{
    constructor(){
        this.db = new sqlite3.Database("./database/sqlite.db", sqlite3.OPEN_READWRITE, (err) => {
            if(err) return console.error(err.message);
            console.log('Connected to DB successfully');
        })
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

    addRanchToDB(ranchName, ID){
        return new Promise((fulfill, reject) => {
            let cash = 1000;
            let sql = `INSERT INTO ranches (ID, ranchName, money) VALUES (${ID}, "${ranchName}", ${cash})`;
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                }else{
                    fulfill(true);
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
                        let sql = `INSERT INTO slimes (ID, server, amount) VALUES (${slimeID}, ${serverID}, 1)`;
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

    _slimeInRanch(slimeID, serverID){
        return new Promise((fulfill, reject) => {
            let sql = `SELECT * FROM slimes WHERE ID = ${slimeID} AND server = ${serverID}`;
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
            let sql = `UPDATE slimes SET amount = amount + 1 WHERE server = ${serverID} AND ID = ${slimeID}`;
            this.db.run(sql, (err) => {
                if(err){
                    reject(err);
                }else{
                    fulfill(true);
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