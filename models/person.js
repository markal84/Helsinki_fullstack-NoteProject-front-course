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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{6,99}$/.test(v);
      },
    },
    required: true,
  },
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
