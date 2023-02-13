const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

console.log("connecting to database");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("sucessfully connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database ", err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    // delete returnedObject.id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
