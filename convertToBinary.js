var argv = process.argv.slice(2);
if (argv.length < 2) {
  console.log("Must specify a file to convert");
}
fs = require("fs");
fs.readFile(argv[0], "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  var words = data.split(" ");
  var numWords = words.length;
  var buffer = new Uint8Array(numWords * 5);
  for (var i = 0; i < numWords; i++) {
    for (var j = 0; j < 5; j++) {
      buffer[i * 5 + j] = words[i].charCodeAt(j) - 96;
    }
  }
  fs.writeFileSync(argv[1], buffer, "binary");
});
