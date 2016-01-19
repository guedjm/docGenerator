global.__base = __dirname + '/';
var path = require('path');
var param = require(__base + 'parameters');
var docGenerator = require(__base + 'docGenerator');

/*const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});*/

//Checking arguments
if (process.argv.length != 7) {
  console.error("Usage: ./docgenerator source version_source build_path version message");
  console.error("source: Documentation input file");
  console.error("version_source: Version input file");
  console.error("build_path: Build directory");
  console.error("version: Project version");
  console.error("message: Version message");

  process.exit(1);
}
else {

  param.sourceFile = path.resolve(process.cwd(), process.argv[2]);
  param.versionFile = path.resolve(process.cwd(), process.argv[3]);
  param.buildDir = path.resolve(process.cwd(), process.argv[4]);
  param.version = process.argv[5];
  param.versionMessage = process.argv[6];
}

var generator = new docGenerator(param);
generator.generate();