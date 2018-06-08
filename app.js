const fs = require("fs");
const zlib = require("zlib");

function compress(input, output) {
  return new Promise((resolve, reject) => {
    var gzip = zlib.createGzip();
    var rs = fs.createReadStream(input);
    var ws = fs.createWriteStream(output);
    var size = 0;

    rs.pipe(
      gzip.on("data", buff => {
        size += buff.length;
      })
    ).pipe(ws);

    ws.on("close", () => {
      resolve(size);
    });

    ws.on("error", err => {
      reject(err);
    });
  });
}

function readFiles(dirname) {
  const readDirPr = new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => (err ? reject(err) : resolve(filenames)));
  });

  return readDirPr.then(filenames => {
    return new Promise((resolve, reject) => {
      resolve(filenames);
    });
  });
}

readFiles("./test").then(
  allContents => {
    allContents.forEach(content => {
      compress(content, content + ".zip").then(result => console.log("Buffer size: " + result));
    });
  },
  error => console.log(error)
);
