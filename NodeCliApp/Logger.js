const fs = require("fs");
const EventEmitter = require("events");
const writableStream = fs.createWriteStream("app.log", { flags: "a" });
class Logger extends EventEmitter {
  info(msg) {
    this.emit("info", msg, new Date().toLocaleString());
  }
  warn(msg) {
    this.emit("warn", msg, new Date().toLocaleString());
  }
  error(msg) {
    this.emit("error", msg, new Date().toLocaleString());
  }
}
const l = new Logger();
l.on("info", (msg, date) => {
  writableStream.write(`${msg} | info | ${date} \n`);
});
l.on("warn", (msg, date) => {
  writableStream.write(`${msg} | warn | ${date} \n`);
});

l.on("error", (msg, date) => {
  writableStream.write(`${msg} | error | ${date} \n`);
});

function readlog() {
  const readLog = fs.createReadStream("app.log", { encoding: "utf-8" });
  readLog.on("data", (chunks) => {
    const lines = chunks.split("\n");
   
    lines.forEach((line) => {
      if (line.includes("info")) {
        console.log(`\x1b[37m${line}\x1b[0m`);
      }
      if (line.includes("warn")) {
        console.log(`\x1b[33m${line}\x1b[0m`);
      }
      if (line.includes("error")) {
        console.log(`\x1b[31m${line}\x1b[0m`);
      }
      
    });
  });
  readLog.on("end", () => {
    console.log("finished");
  });
}

const logs = [
  { type: "info", message: "Server Started" },
  { type: "warn", message: "Memory High" },
  { type: "error", message: "Database Failed" },
];

let count = 0;
const interval = setInterval(() => {
  let idx = count % 3;
  l[logs[idx].type](logs[idx].message);

  count++;
  if (count === 10) {
    clearInterval(interval);
    writableStream.end();
    writableStream.on("finish", () => {
      console.log("All logs written.");
      readlog();
    });
  }
}, 500);
