// Data -----------------------------------------------------------------------

import * as gdpi from "./data-gdpi.js";
import * as ggn from "./data-ggn.js";
import * as dieghv from "./data-dieghv.js";
import * as pujtones from "./data-tones-puj.js";

const alldata = {
  'gdpi' : gdpi,
  'ggn' : ggn,
  'dieghv' : dieghv,
  'pujtones' : pujtones
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
  let strippedWord = "";
  let toneNumber = 0;
  let wordNormalized = syllable.normalize('NFD');
  for (let i = 0; i < wordNormalized.length; i++) {
    let char = wordNormalized[i];
    let charCode = char.charCodeAt(0);
    // Combining Diacritical Marks block 0300-036F
    if (charCode >= Number("0x300") && charCode <= Number("0x36F")) {
      if (charCode in pujtones.toneCodeToNumber) {
        toneNumber = pujtones.toneCodeToNumber[charCode];
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

function parseGdpiLikeSyllable(syllable, system) {
  // TODO handle error if syllable does not match regex
  let res = syllable.normalize('NFC').match(alldata[system].syllableRe);
  let [initial, medial, coda, tonenumber] = res.slice(1,5);
  // Fix cases not caught by regex
  // analyze solitary "ng" as final
  if (initial == "ng" && medial == "" && coda == "") {
    coda = "ng";
    initial = "";
    medial = "";
  }
  // ng finals with no vowel, e.g. cng1
  if (initial.endsWith("ng") && initial.length > 2 && medial == "" && coda == "") {
    initial = initial.slice(0,-2);
    coda = "ng";
  }
  // Convert to PUJ + numeric tone
  if ( initial in alldata[system].initialToPuj ) {
    initial = alldata[system].initialToPuj[initial];
  } else {
    throw new Error("Initial not recognized: " + initial);
  }
  if ( medial in alldata[system].medialToPuj ) {
    medial = alldata[system].medialToPuj[medial];
  } else {
    throw new Error("Medial not recognized: " + medial);
  }
  if ( coda in alldata[system].codaToPuj ) {
    coda = alldata[system].codaToPuj[coda];
  } else {
    throw new Error("Coda not recognized: " + coda);
  }
  return [initial, medial, coda, tonenumber];
}

class Syllable {
  constructor(verbatim, verbatimSystem) {
    this.verbatim = verbatim;
    this.verbatimSystem = verbatimSystem;
    if (verbatimSystem == "puj") {
      [this.initial, this.medial, this.coda, this.tonenumber] = parsePujSyllable(verbatim);
    } else if (["gdpi", "ggn", "dieghv"].includes(verbatimSystem)) {
      [this.initial, this.medial, this.coda, this.tonenumber] = parseGdpiLikeSyllable(verbatim, verbatimSystem);
    } else {
      throw new Error("Unsupported system " + verbatimSystem);
    }
  }

  returnPuj() {
    let toneless = [this.initial, this.medial, this.coda].join("");
    return addToneDiacriticPujLike(toneless, this.tonenumber, pujtones);
  }

  returnGdpiLike(system) {
    // GDPI-like systems
    let initial = "";
    let medial = "";
    let coda = "";
    if ( this.initial in alldata[system].initialFromPuj ) {
      initial = alldata[system].initialFromPuj[this.initial];
    } else {
      throw new Error("Initial not recognized: " + this.initial);
    }
    if ( this.medial in alldata[system].medialFromPuj ) {
      medial = alldata[system].medialFromPuj[this.medial];
    } else {
      throw new Error("Medial not recognized: " + this.medial);
    }
    if ( this.coda in alldata[system].codaFromPuj ) {
      coda = alldata[system].codaFromPuj[this.coda];
    } else {
      throw new Error("Coda not recognized: " + this.coda);
    }
    return [initial, medial, coda, this.tonenumber].join("");
  }

  convert(system) {
    if (system == "puj") {
      return this.returnPuj();
    } else if (["gdpi","ggn","dieghv"].includes(system)) {
      return this.returnGdpiLike(system);
    } else {
      throw new Error("Unrecognized system " + system);
    }
  }

}

function addToneDiacriticPujLike(toneless, tonenumber, tonedata) {
  // Add tone diacritic according to orthographic rules
  let toneLetterIndex = -1;
  // Add diacritic on first vowel that is not i
  if (toneless.match(/[aeouo̤ṳ]/)) {
    toneLetterIndex = toneless.match(/[aeouṳ]/).index;
  } else if (toneless.match(/i/)) {
    // Else on first i
    toneLetterIndex = toneless.match(/i/).index;
  } else if (toneless.match(/[nm]/)) {
    // Else on first n or m
    toneLetterIndex = toneless.match(/[nm]/).index;
  } else {
    throw new Error("Cannot place tone diacritic on " + toneless);
  }
  let pre = toneless.slice(0,toneLetterIndex+1);
  let post = "";
  if (toneless.length > toneLetterIndex + 1) {
    post = toneless.slice(toneLetterIndex+1,);
  }
  // Default no diacritic for tones 1 and 4
  let toneDiacritic = "";
  if (tonenumber in tonedata.toneNumberToCode) {
    let toneCodePoint = tonedata.toneNumberToCode[tonenumber];
    toneDiacritic = String.fromCodePoint(toneCodePoint);
  }
  let withTone = [pre, toneDiacritic, post].join("").normalize("NFC");
  return withTone;
}

// Apply conversion to each segmented element ("word")
// Add delimiters around words that cannot be converted
function convertWord(word, from="puj", to="gdpi", invalidLeftDelim="[", invalidRightDelim="]") {
  try {
    let syllable = new Syllable(word, from);
    return syllable.convert(to);
  } catch(e) {
    console.error(e.name + ": " + e.message);
    return invalidLeftDelim + word + invalidRightDelim;
  }
}

// Apply conversion to entire line
function convertLine(line, from="puj", to="gdpi", invalidLeftDelim="[", invalidRightDelim="]") {
  let result = [];
  for (const word of splitText(line)) {
    result.push(convertWord(word, from, to, invalidLeftDelim, invalidRightDelim));
  }
  return result.join(" ");
}

export { convertLine };
