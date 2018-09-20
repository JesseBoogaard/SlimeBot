const sqlite3 = require('sqlite3').verbose();

class SlimeDB{
  constructor(name, user){
    this.name = name;
    this.user = user;
    this.db = new sqlite3.Database("./database/sqlite.db", sqlite3.OPEN_READWRITE, (err) => {
      if(err) return console.error('err.message');
      console.log('Connected to DB successfully')
    })
  }

  addRanchToDB(ranchName, ID){
    console.log(ranchName)
    console.log(ID)
  }

  getRanchInfo(ID){
    let sql = `SELECT * FROM ranches WHERE ID = ${ID} `
    this.db.each(sql, (err, row) => {
      if(err){throw err;}
      console.log(row.ID, row.ranchName);
    })
  }
}

module.exports = SlimeDB;