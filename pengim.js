const pujCodeToNumber = {
  0x301 : 2,
  0x300 : 3,
  0x302 : 5,
  0x306 : 6,
  0x30C : 6,
  0x304 : 7,
  0x305 : 7,
  0x30D : 8
};

function splitText(text) {
  // TODO Split on punctuation and spaces but retain them
  // remove all punctuation and replace with spaces
  let newText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g," ");
  // split text into array of words
  let words = newText.split(" ");
  // remove any empty strings from array
  words = words.filter(word => word !== "");
  return words;
}

function segmentPujSyllable(syllable) {
  // TODO handle error if syllable does not match regex
  const pujRe = /^([^aeiouṳ]*)([aeiouṳ]*)([hptkmngⁿ]*)$/;
  let res = syllable.match(pujRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  return res;
}

function parsePujSyllable(syllable) {
  let strippedWord = "";
  let toneNumber = 0;
  let wordNormalized = syllable.normalize('NFD');
  for (let i = 0; i < wordNormalized.length; i++) {
    let char = wordNormalized[i];
    let charCode = char.charCodeAt(0);
    // Combining Diacritical Marks block 0300-036F
    if (charCode >= Number("0x300") && charCode <= Number("0x36F")) {
      if (charCode in pujCodeToNumber) {
        toneNumber = pujCodeToNumber[charCode];
      } else if (charCode == Number("0x324")) {
        // combining diaeresis below
        strippedWord += wordNormalized[i];
      } else {
        console.log("Diacritic not used in PUJ: " + charCode);
        toneNumber = -1;
      }
    } else {
      // add non-diacritic character to stripped syllable
      strippedWord += char;
    }
  }
  let res = segmentPujSyllable(strippedWord)
  if (toneNumber == 0) {
    if (res[3].match(/[hpkt]/)) {
      toneNumber = 4;
    } else {
      toneNumber = 1;
    }
  }
  return [res[1], res[2], res[3], toneNumber];
}

// main ----------------------------------------------------------------------

// Create a readline interface to read lines from stdin
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to apply parsePujSyllable to each line
function applyParsePujSyllable(line) {
  // Call parsePujSyllable function and return the result
  return parsePujSyllable(line);
}

// Prompt user to enter lines
rl.question('Enter lines (press CTRL+C to exit): ', (lines) => {
  // Split the lines by newline character
  const linesArr = lines.split('\n');
  
  // Loop through each line and apply parsePujSyllable function
  for (let i = 0; i < linesArr.length; i++) {
    let result = [];
    for (const word of splitText(linesArr[i])) {
      result.push(applyParsePujSyllable(word));
    }
    console.log(result);
  }
  
  // Close the readline interface
  rl.close();
});
