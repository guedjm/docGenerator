global.__base = __dirname + '/';
var fs = require('fs');
var ncp = require('ncp').ncp;
var apiDocumentation = require(__base + 'element/apiDocumentation');
var desc = new apiDocumentation();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Checking arguments
if (process.argv.length != 4) {
  console.error("Usage: ./docgenerator filename version");
  console.error("filename: Input file");
  console.error("version: Project version");
  console.error("");

  process.exit(1);
} else {
  var filename = process.argv[2];
  var version = process.argv[3];
}

//Parse file
desc.parseFile(filename, version);

if (desc.error) {
  process.exit(1);
}

//Get html result
var html = desc.render();

//Creating result env
try {
  var res = fs.statSync('./dist');

  if (!res.isDirectory()) {
    createDistDir(createVersionDir);
  }
  else {
    createVersionDir();
  }
}
catch (e) {
  createDistDir(createVersionDir);
}


function createDistDir(done) {

  console.log('Creating dist directory ...');
  fs.mkdirSync('./dist');
  ncp(__base + 'src/css', './dist/css', function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    ncp(__base + 'src/js', './dist/js', function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      ncp(__base + 'src/fonts', './dist/fonts', function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        else {
          done();
        }
      });
    });
  });
}

function createVersionDir() {
  try {
    var res = fs.statSync('./dist/v' + version);

  }
  catch (e) {
    console.log('Creating version directory');
    fs.mkdirSync('./dist/v' + version);
  }

  try {
    var res = fs.statSync('./dist/v' + version + '/index.html');

    rl.question("File ./dist/v" + version + "/index.html exits, erase ? [y/n] ", function (answer) {

      if (answer == 'y') {
        console.log('Removing existing file');
        fs.unlink('./dist/v' + version + '/index.html');
        writeHtml();
      }
      else {
        console.error('Abort');
        process.exit(1);
      }
    });
  }
  catch (e) {
    writeHtml();
  }
}

function writeHtml() {
  console.log("Writting output file");

  try {
    fs.writeFile('./dist/v' + version + '/index.html', html, function (err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      else {
        console.log("Done");
        process.exit(0);
      }
    });
  }
  catch (e) {
  }

}