import commander from 'commander';
import readline from 'readline';
import { convertLine } from './src/pengim.js';

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-f, --from <name>', 'Scheme to convert from: puj, gdpi, ggn, dieghv, fielde', 'puj')
  .option('-t, --to <name>', 'Scheme to convert to: puj, gdpi, ggn, dieghv', 'gdpi')
  .parse(process.argv);

const options = commander.opts();
const systems = ['puj', 'gdpi','ggn','dieghv'];

// Main ----------------------------------------------------------------------

// Create a readline interface to read lines from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (!options.from && !options.to) {
  console.error('Please specify -f and -t, see help with option -h');
  process.exit(1);
}

// Prompt user to enter lines
rl.question('Enter input (press CTRL+C to exit): ', (lines) => {
  // Split the lines by newline character
  const linesArr = lines.split('\n');
  // Loop through each line and apply convertLine function
  for (let i = 0; i < linesArr.length; i++) {
    let out = "";
    out = convertLine(linesArr[i], options.from, options.to);
    console.log(out);
  }
  
  // Close the readline interface
  rl.close();
});
