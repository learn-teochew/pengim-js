// Data -----------------------------------------------------------------------

import * as gdpi from "./data-gdpi.js";
import * as ggn from "./data-ggn.js";
import * as dieghv from "./data-dieghv.js";
import * as tones from "./data-tones.js";

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
      if (charCode in tones.pujCodeToNumber) {
        toneNumber = tones.pujCodeToNumber[charCode];
      } else if (charCode == Number("0x324")) {
        // combining diaeresis below
        strippedWord += wordNormalized[i];
      } else {
        throw new Error("Diacritic not used in PUJ: " + charCode);
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
  if (res[3] == -1) { // TODO change this to try catch
    return "[" + syllable  + "]";
  } else {
    return res.join("");
  }
}

function pujToGdpiLike(syllable, data) {
  // PUJ with tone diacritics to GDPI-like
  let res = parsePujSyllable(syllable);
  if (res[3] == -1) {
    return "[" + syllable  + "]";
  } else {
    // TODO Catch exception if segments not in dicts
    if ( res[0] in data.initialFromPuj ) {
      res[0] = data.initialFromPuj[res[0]];
    } else {
      throw new Error("Initial not recognized: " + res[0]);
    }
    if ( res[1] in data.medialFromPuj ) {
      res[1] = data.medialFromPuj[res[1]];
    } else {
      throw new Error("Medial not recognized: " + res[1]);
    }
    if ( res[2] in data.codaFromPuj ) {
      res[2] = data.codaFromPuj[res[2]];
    } else {
      throw new Error("Final not recognized: " + res[2]);
    }
    return res.join("");
  }
}

function parseGdpiLikeSyllable(syllable, data) {
  // TODO handle error if syllable does not match regex
  let res = syllable.normalize('NFC').match(data.syllableRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  // ng finals with no vowel, e.g. cng1
  if (res[1].endsWith("ng") && res[1].length > 2 && res[2] == "" && res[3] == "") {
    res[1] = res[1].slice(0,-2);
    res[3] = "ng";
  }
  return [res[1], res[2], res[3], res[4]];
}

function gdpiLikeToPuj(syllable, data) {
  // GDPI-like to PUJ with tone diacritics
  // TODO add option to analyze without tones
  let res = parseGdpiLikeSyllable(syllable, data);
  // TODO Catch exception if segments not in dicts
  res[0] = data.initialToPuj[res[0]];
  res[1] = data.medialToPuj[res[1]];
  res[2] = data.codaToPuj[res[2]];
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
  if (res[3] in tones.pujNumberToCode) {
    let toneCodePoint = tones.pujNumberToCode[res[3]];
    toneDiacritic = String.fromCodePoint(toneCodePoint);
  }
  let withTone = [pre, toneDiacritic, post].join("").normalize("NFC");
  return withTone;
}

// Apply conversion to each word
function convertWord(word, direction="fromPuj", system="gdpi") {
  if (direction == "toPuj") {
    if (system == "gdpi") {
      return gdpiLikeToPuj(word, gdpi);
    } else if (system == "ggn") {
      return gdpiLikeToPuj(word, ggn);
    } else if (system == "dieghv") {
      return gdpiLikeToPuj(word, dieghv);
    }
  } else if (direction == "fromPuj") {
    try {
      if (system == "gdpi") {
        return pujToGdpiLike(word, gdpi);
      } else if (system == "ggn") {
        return pujToGdpiLike(word, ggn);
      } else if (system == "dieghv") {
        return pujToGdpiLike(word, dieghv);
      }
    } catch(e) {
      console.error(e.name + ": " + e.message);
      return "[" + word + "]";
    }
  }
}

// Apply conversion to entire line
function convertLine(line, direction="fromPuj", system="gdpi") {
  let result = [];
  for (const word of splitText(line)) {
    result.push(convertWord(word, direction, system));
  }
  return result.join(" ");
}

export { convertLine };
