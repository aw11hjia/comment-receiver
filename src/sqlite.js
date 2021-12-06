/**
 * Module handles database management
 *
 * Server API calls the methods in here to query and update the SQLite database
 */

// Utilities we need
const fs = require("fs");

// Initialize the database
const dbFile = "./.data/comment.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

/* 
We're using the sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
*/
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    // We use try and catch blocks throughout to handle any database errors
    try {
      // The async / await syntax lets us write the db operations in a way that won't block the app
      if (!exists) {
        // Database doesn't exist yet - create Choices and Log tables

        await db.run (
          "CREATE TABLE COMMENT (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, role TEXT, score TEXT, comment TEXT)"
        );
        
      } else {
        // We have a database already - write Choices records to log for info
        console.log(await db.all("SELECT * from COMMENT"));

        //If you need to remove a table from the database use this syntax
        //db.run("DROP TABLE Logs"); //will fail if the table doesn't exist
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Our server script will call these methods to connect to the db
module.exports = {
  addComment: async (firstName, lastName, role, score, comment) => {
      try {
        console.log('comment received2!');
        console.log(firstName+" "+lastName+" "+role+" "+ score+" "+ comment);
        console.log('db= '+JSON.stringify(db));
        await db.run("INSERT INTO COMMENT (firstName, lastName, role, score, comment) VALUES (?, ?, ?, ?, ?)", [
            firstName, lastName, role, score, comment
          ]);
        return true;
      } catch (dbError) {
        console.error(dbError);
      }
    },

    viewComment: async () => {

        try {
            console.log('get comment called')
            let result = await db.all(
                "SELECT * FROM COMMENT"
              );
            console.log('result: '+result);
          return result;
        } catch (dbError) {
          console.error(dbError);
        }
    }

};
