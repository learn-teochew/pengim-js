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
  // ng finals with no vowel
  if (res[1].endsWith("ng") && res[1].length > 2 && res[2] == "" && res[3] == "") {
    res[1] = res[1].slice(0,-2);
    res[3] = "ng";
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
  let res = parsePujSyllable(syllable);
  if (res[3] == -1) {
    return "[" + syllable  + "]";
  } else {
    return res.join("");
  }
}

function pujToGdpi(syllable) {
  // PUJ with tone diacritics to GDPI
  let res = parsePujSyllable(syllable);
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
  const gdpiRe = /^([^aêeiou\d]*)([aêeiou]*)([hbgmn]*)([012345678]*)$/;
  let res = syllable.match(gdpiRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  // ng finals with no vowel
  if (res[1].endsWith("ng") && res[1].length > 2 && res[2] == "" && res[3] == "") {
    res[1] = res[1].slice(0,-2);
    res[3] = "ng";
  }
  return [res[1], res[2], res[3], res[4]];
}

function gdpiToPuj(syllable) {
  // GDPI to PUJ with tone diacritics
  // TODO add option to analyze without tones
  let res = parseGdpiSyllable(syllable);
  // TODO Catch exception if segments not in dicts
  res[0] = initialGdpiToPuj[res[0]];
  res[1] = medialGdpiToPuj[res[1]];
  res[2] = codaGdpiToPuj[res[2]];
  let toneless = res.slice(0,3).join("");
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
  let pre = toneless.slice(0,toneLetterIndex+1);
  let post = "";
  if (toneless.length > toneLetterIndex + 1) {
    post = toneless.slice(toneLetterIndex+1,);
  }
  // Default no diacritic for tones 1 and 4
  let toneDiacritic = "";
  if (res[3] in pujNumberToCode) {
    let toneCodePoint = pujNumberToCode[res[3]];
    toneDiacritic = String.fromCodePoint(toneCodePoint);
  }
  let withTone = [pre, toneDiacritic, post].join("").normalize("NFC");
  return withTone;
}

// Apply conversion to each word
function convertWord(word, version) {
  if (version == "gdpi2puj") {
    return gdpiToPuj(word);
  } else if (version == "puj2gdpi") {
    return pujToGdpi(word);
  }
}

// Apply conversion to entire line
function convertLine(line, version) {
  let result = [];
  for (const word of splitText(line)) {
    result.push(convertWord(word, version));
  }
  return result.join(" ");
}

export { convertLine };