import commander from 'commander';
import readline from 'readline';
import { convertLine } from './src.js';

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-g, --gdpi2puj', 'Convert from Guangdong Pêng-im to Pe̍h-ūe-jī')
  .option('-p, --puj2gdpi', 'Convert from Pe̍h-ūe-jī to Guangdong Pêng-im')
  .parse(process.argv);

const options = commander.opts();

// Main ----------------------------------------------------------------------

// Create a readline interface to read lines from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (!options.gdpi2puj && !options.puj2gdpi) {
  console.error('Please specify either -g or -p, see help with option -h');
  process.exit(1);
}

// Prompt user to enter lines
rl.question('Enter input (press CTRL+C to exit): ', (lines) => {
  // Split the lines by newline character
  const linesArr = lines.split('\n');
  // Loop through each line and apply convertLine function
  for (let i = 0; i < linesArr.length; i++) {
    let out = "";
    if (options.gdpi2puj) {
      out = convertLine(linesArr[i], "gdpi2puj");
    } else if (options.puj2gdpi) {
      out = convertLine(linesArr[i], "puj2gdpi");
    }
    console.log(out);
  }
  
  // Close the readline interface
  rl.close();
});
