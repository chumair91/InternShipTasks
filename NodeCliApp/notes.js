const fs = require("fs");
const path = require("path");
// const arr = [];
const command = process.argv[2];
const input = process.argv[3];

const filePath = path.join(__dirname, "notes.json");
let notes = [];
try {
  const data = fs.readFileSync(filePath, "utf8");
  notes = JSON.parse(data);
} catch (error) {
  notes = [];
}

// console.log("Current Directory:", __dirname);

if (command === "add") {
  notes.push(input);
  if (!input) {
    console.log("Please provide a note.");
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
  console.log("Note added successfully.");
} else if (command === "list") {
  if (notes.length === 0) {
    console.log("No notes found.");
    return;
  }

  notes.forEach((data, index) => {
    console.log(index + 1, data);
  });
} else if (command === "delete") {
     if (!index || index < 1 || index > notes.length) {
    console.log("Invalid note index.");
    return;
  }
  notes.splice(input - 1, 1);
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
} else if (command === "clear") {
  notes = [];
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}
