const commander = require('commander');

commander
  .version('1.0.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-g, --gdpi2puj', 'Convert from Guangdong Pêng-im to Pe̍h-ūe-jī')
  .option('-p, --puj2gdpi', 'Convert from Pe̍h-ūe-jī to Guangdong Pêng-im')
  .parse(process.argv);

const options = commander.opts();

// Data -----------------------------------------------------------------------

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

const pujNumberToCode = {
  2 : 0x301 ,
  3 : 0x300 ,
  5 : 0x302 ,
  6 : 0x306 ,
  7 : 0x304 ,
  8 : 0x30D 
};

const initialPujToGdpi = {
  ""    : ""  ,
  "p"   : "b" ,
  "ph"  : "p" ,
  "b"   : "bh",
  "m"   : "m" ,
  "t"   : "d" ,
  "th"  : "t" ,
  "n"   : "n" ,
  "l"   : "l" ,
  "ts"  : "z" ,
  "ch"  : "z" ,
  "tsh" : "c" ,
  "chh" : "c" ,
  "s"   : "s" ,
  "z"   : "r" ,
  "j"   : "r" ,
  "dz"  : "r" ,
  "k"   : "g" ,
  "kh"  : "k" ,
  "g"   : "gh",
  "ng"  : "ng",
  "h"   : "h"
}

const medialPujToGdpi = {
  ""    : ""   ,
  "a"   : "a"  ,
  "o"   : "o"  ,
  "e"   : "ê"  ,
  "ṳ"   : "e"  ,
  "ai"  : "ai" ,
  "oi"  : "oi" ,
  "ei"  : "êi" ,
  "au"  : "ao" ,
  "ou"  : "ou" ,
  "i"   : "i"  ,
  "ia"  : "ia" ,
  "io"  : "io" ,
  "ie"  : "iê" ,
  "iou" : "iou",
  "ieu" : "iêu",
  "iau" : "iao",
  "iu"  : "iu" ,
  "u"   : "u"  ,
  "ua"  : "ua" ,
  "ue"  : "uê" ,
  "uai" : "uai",
  "uei" : "uêi",
  "ui"  : "ui"
}

const codaPujToGdpi = {
  ""   : ""  ,
  "h"  : "h" ,
  "p"  : "b" ,
  "m"  : "m" ,
  "n"  : "ng",
  "ng" : "ng",
  "t"  : "g" ,
  "k"  : "g" ,
  "ⁿ"  : "n" ,
  "ⁿh" : "nh"
}

const initialGdpiToPuj = {
  ""  : ""    ,
  "b" : "p"   ,
  "p" : "ph"  ,
  "bh": "b"   ,
  "m" : "m"   ,
  "d" : "t"   ,
  "t" : "th"  ,
  "n" : "n"   ,
  "l" : "l"   ,
  "z" : "ts"  ,
  "c" : "tsh" ,
  "s" : "s"   ,
  "r" : "j"   ,
  "g" : "k"   ,
  "k" : "kh"  ,
  "gh": "g"   ,
  "ng": "ng"  ,
  "h" : "h"   
}

const medialGdpiToPuj = {
  ""   : ""    ,
  "a"  : "a"   ,
  "o"  : "o"   ,
  "ê"  : "e"   ,
  "e"  : "ṳ"   ,
  "ai" : "ai"  ,
  "oi" : "oi"  ,
  "êi" : "ei"  ,
  "ao" : "au"  ,
  "ou" : "ou"  ,
  "i"  : "i"   ,
  "ia" : "ia"  ,
  "io" : "io"  ,
  "iê" : "ie"  ,
  "iou": "iou" ,
  "iêu": "ieu" ,
  "iao": "iau" ,
  "iu" : "iu"  ,
  "u"  : "u"   ,
  "ua" : "ua"  ,
  "uê" : "ue"  ,
  "uai": "uai" ,
  "uêi": "uei" ,
  "ui" : "ui"  
}

const codaGdpiToPuj = {
  ""  : ""   ,
  "h" : "h"  ,
  "b" : "p"  ,
  "m" : "m"  ,
  "ng": "ng" ,
  "g" : "k"  ,
  "n" : "ⁿ"  ,
  "nh": "ⁿh" 
}

// Functions ------------------------------------------------------------------

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
  // TODO Add option parse without tone markings
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
        console.error("Diacritic not used in PUJ: " + charCode);
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

function pujToPujn(syllable) {
  // PUJ with tone diacritics to PUJ with tone number
  res = parsePujSyllable(syllable);
  if (res[3] == -1) {
    return "[" + syllable  + "]";
  } else {
    return res.join("");
  }
}

function pujToGdpi(syllable) {
  // PUJ with tone diacritics to GDPI
  res = parsePujSyllable(syllable);
  if (res[3] == -1) {
    return "[" + syllable  + "]";
  } else {
    // TODO Catch exception if segments not in dicts
    res[0] = initialPujToGdpi[res[0]];
    res[1] = medialPujToGdpi[res[1]];
    res[2] = codaPujToGdpi[res[2]];
    return res.join("");
  }
}

function parseGdpiSyllable(syllable) {
  // TODO handle error if syllable does not match regex
  const gdpiRe = /^([^aêeiou]*)([aêeiou]*)([hbgmn]*)([012345678]*)$/;
  let res = syllable.match(gdpiRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  return [res[1], res[2], res[3], res[4]];
}

function gdpiToPuj(syllable) {
  // GDPI to PUJ with tone diacritics
  // TODO add option to analyze without tones
  res = parseGdpiSyllable(syllable);
  // TODO Catch exception if segments not in dicts
  res[0] = initialGdpiToPuj[res[0]];
  res[1] = medialGdpiToPuj[res[1]];
  res[2] = codaGdpiToPuj[res[2]];
  toneless = res.slice(0,3).join("");
  // Add tone diacritic according to orthographic rules
  let toneLetterIndex = -1;
  // Add diacritic on first vowel that is not i
  if (toneless.match(/[aeouṳ]/)) {
    toneLetterIndex = toneless.match(/[aeouṳ]/).index;
  } else if (toneless.match(/i/)) {
    // Else on first i
    toneLetterIndex = toneless.match(/i/).index;
  } else if (toneless.match(/[nm]/)) {
    // Else on first n or m
    toneLetterIndex = toneless.match(/[nm]/).index;
  }
  pre = toneless.slice(0,toneLetterIndex+1);
  post = "";
  if (toneless.length > toneLetterIndex + 1) {
    post = toneless.slice(toneLetterIndex+1,);
  }
  // Default no diacritic for tones 1 and 4
  let toneDiacritic = "";
  if (res[3] in pujNumberToCode) {
    toneCodePoint = pujNumberToCode[res[3]];
    toneDiacritic = String.fromCodePoint(toneCodePoint);
  }
  let withTone = [pre, toneDiacritic, post].join("").normalize("NFC");
  return withTone;
}

// Main ----------------------------------------------------------------------

// Create a readline interface to read lines from stdin
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to apply conversion to each word
function convertWord(word) {
  if (options.gdpi2puj) {
    return gdpiToPuj(word);
  } else if (options.puj2gdpi) {
    return pujToGdpi(word);
  }
}

if (!options.gdpi2puj && !options.puj2gdpi) {
  console.error("Please specify either -g or -p, see help with option -h");
  process.exit(1);
}

// Prompt user to enter lines
rl.question('Enter input (press CTRL+C to exit): ', (lines) => {
  // Split the lines by newline character
  const linesArr = lines.split('\n');
  
  // Loop through each line and apply convertWord function
  for (let i = 0; i < linesArr.length; i++) {
    let result = [];
    for (const word of splitText(linesArr[i])) {
      result.push(convertWord(word));
    }
    console.log(result);
  }
  
  // Close the readline interface
  rl.close();
});
