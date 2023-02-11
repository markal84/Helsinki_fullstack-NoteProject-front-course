const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// const log = { name, number };

const url = `mongodb+srv://kalet1984:${password}@kodilla.enwks.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", noteSchema);

const person = new Person({
  name,
  number,
});

// save person
const savePerson = () => {
  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
};

//print persons
const printList = () => {
  Person.find({}).then((result) => {
    console.log("Phonebook: ");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length > 3) {
  savePerson();
} else {
  printList();
}
