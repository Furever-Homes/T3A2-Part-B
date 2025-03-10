require("dotenv").config();
const { dbConnect, dbDisconnect, dbDrop } = require("./database");

async function drop() {
  await dbDrop();

  await dbDisconnect();

  console.log("Disconnected!");
}

dbConnect().then(() => {
  console.log("Connected to the Database. Dropping now...");
  drop();
});
