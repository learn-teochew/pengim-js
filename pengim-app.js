import commander from 'commander';
import readline from 'readline';
import { convertLine } from './src/pengim.js';

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-f, --fromPuj', 'Convert from Pe̍h-ūe-jī input')
  .option('-t, --toPuj', 'Convert into Pe̍h-ūe-jī output')
  .option('-s, --system <name>', 'Scheme to convert to/from: gdpi, ggn, dieghv', 'gdpi')
  .parse(process.argv);

const options = commander.opts();
const systems = ['gdpi','ggn','dieghv'];

// Main ----------------------------------------------------------------------

// Create a readline interface to read lines from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (!options.fromPuj && !options.toPuj) {
  console.error('Please specify either -f or -t, see help with option -h');
  process.exit(1);
}

if (!systems.includes(options.system)) {
  console.error('Unknown option ' + options.system + ', please specify one of: ' + systems.join(" "));
  process.exit(1);
}

// Prompt user to enter lines
rl.question('Enter input (press CTRL+C to exit): ', (lines) => {
  // Split the lines by newline character
  const linesArr = lines.split('\n');
  // Loop through each line and apply convertLine function
  for (let i = 0; i < linesArr.length; i++) {
    let out = "";
    if (options.toPuj) {
      out = convertLine(linesArr[i], "toPuj", options.system);
    } else if (options.fromPuj) {
      out = convertLine(linesArr[i], "fromPuj", options.system);
    }
    console.log(out);
  }
  
  // Close the readline interface
  rl.close();
});
