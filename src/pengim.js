// Data -----------------------------------------------------------------------

import * as gdpi from "./data-gdpi.js";
import * as ggn from "./data-ggn.js";
import * as dieghv from "./data-dieghv.js";
import * as fielde from "./data-fielde.js";
import * as ipa from "./data-ipa.js";
import * as pujtones from "./data-tones-puj.js";
import * as fieldetones from "./data-tones-fielde.js";

const alldata = {
  gdpi: gdpi,
  ggn: ggn,
  dieghv: dieghv,
  fielde: fielde,
  ipa: ipa,
  pujtones: pujtones,
  fieldetones: fieldetones,
};

const superscriptnum = {
  0: "",
  1: "¹",
  2: "²",
  3: "³",
  4: "⁴",
  5: "⁵",
  6: "⁶",
  7: "⁷",
  8: "⁸",
};

const ipatones = {
  0: "",
  1: "˧",
  2: "˥˧",
  3: "˨˩˧",
  4: "˨.",
  5: "˥",
  6: "˧˥",
  7: "˩",
  8: "˥.",
};

// Functions ------------------------------------------------------------------

function checkCase(text) {
  let decomp = text.normalize("NFD");
  // Unicode character class escape \p
  // https://unicode.org/Public/UCD/latest/ucd/PropertyValueAliases.txt
  // u "Unicode" flag for regex
  let matchLu = text.match(/\p{Lu}/gu);
  let matchLuFirst = text[0].match(/\p{Lu}/gu);
  let matchLl = text.match(/\p{Ll}/gu);
  let capstatus = "";
  if (
    matchLu &&
    matchLuFirst &&
    matchLuFirst.length == 1 &&
    matchLu.length == 1
  ) {
    capstatus = "initial";
  } else if (matchLu && !matchLl) {
    capstatus = "upper";
  } else if (matchLl && !matchLu) {
    capstatus = "lower";
  } else {
    capstatus = "mIxEd";
  }
  return capstatus;
}

function segmentPujSyllable(syllable) {
  // TODO handle error if syllable does not match regex
  const pujRe = /^([phbmtnlsczjdkg]*)([aeiouṳ]*)([hptkmngⁿ]*)$/;
  let res = syllable.match(pujRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  // ng finals with no vowel
  if (
    res[1].endsWith("ng") &&
    res[1].length > 2 &&
    res[2] == "" &&
    res[3] == ""
  ) {
    res[1] = res[1].slice(0, -2);
    res[3] = "ng";
  }
  // TODO solitary m, ngh, hngh
  return res;
}

function parsePujSyllable(syllable) {
  let strippedWord = "";
  let toneNumber = 0;
  let wordNormalized = syllable.normalize("NFD");
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
  let res = segmentPujSyllable(strippedWord);
  if (toneNumber == 0) {
    if (res[3].match(/[hpkt]/)) {
      toneNumber = 4;
    } else {
      toneNumber = 1;
    }
  }
  return [res[1], res[2], res[3], toneNumber];
}

function parsePujnSyllable(syllable) {
  // PUJ with tone numbers instead of diacritics
  let segnum = syllable.match(/^(\D+)([012345678]*)$/);
  let [toneless, toneNumber] = [segnum[1], segnum[2]];
  let res = segmentPujSyllable(toneless);
  return [res[1], res[2], res[3], toneNumber];
}

function segmentFieldeSyllable(syllable) {
  // TODO handle error if syllable does not match regex
  let res = syllable.match(fielde.syllableRe);
  // analyze solitary "ng" as final
  if (res[1] == "ng" && res[2] == "" && res[3] == "") {
    res[3] = "ng";
    res[1] = "";
    res[2] = "";
  }
  // ng finals with no vowel
  if (
    res[1].endsWith("ng") &&
    res[1].length > 2 &&
    res[2] == "" &&
    res[3] == ""
  ) {
    res[1] = res[1].slice(0, -2);
    res[3] = "ng";
  }
  let [initial, medial, coda] = ["", "", ""];
  if (res[1] in fielde.initialToPuj) {
    initial = fielde.initialToPuj[res[1]];
  } else {
    throw new Error("Initial not recognized: " + initial);
  }
  if (res[2] + res[3] in fielde.finalToPuj) {
    [medial, coda] = fielde.finalToPuj[res[2] + res[3]];
  } else {
    throw new Error("Final not recognized: " + res[2] + res[3]);
  }
  return [syllable, initial, medial, coda];
}

function parseFieldeSyllable(syllable) {
  let strippedWord = "";
  let toneNumber = 0;
  let wordNormalized = syllable.normalize("NFD");
  for (let i = 0; i < wordNormalized.length; i++) {
    let char = wordNormalized[i];
    let charCode = char.charCodeAt(0);
    // Combining Diacritical Marks block 0300-036F
    if (charCode >= Number("0x300") && charCode <= Number("0x36F")) {
      if (charCode in fieldetones.toneCodeToNumber) {
        toneNumber = fieldetones.toneCodeToNumber[charCode];
      } else if (charCode == Number("0x324")) {
        // combining diaeresis below
        strippedWord += wordNormalized[i];
      } else {
        throw new Error("Diacritic not used in Fielde: " + charCode);
      }
    } else {
      // add non-diacritic character to stripped syllable
      strippedWord += char;
    }
  }
  let res = segmentFieldeSyllable(strippedWord);
  if (toneNumber == 0) {
    if (res[3].match(/[hpkt]/)) {
      toneNumber = 4;
    } else {
      toneNumber = 1;
    }
  } else if (toneNumber == 58) {
    if (res[3].match(/[hpkt]/)) {
      toneNumber = 8;
    } else {
      toneNumber = 5;
    }
  }
  return [res[1], res[2], res[3], toneNumber];
}

function parseGdpiLikeSyllable(syllable, system) {
  // TODO handle error if syllable does not match regex
  let res = syllable.normalize("NFC").match(alldata[system].syllableRe);
  let [initial, medial, coda, tonenumber] = res.slice(1, 5);
  // Fix cases not caught by regex
  // analyze solitary "ng" as final
  if (initial == "ng" && medial == "" && coda == "") {
    coda = "ng";
    initial = "";
    medial = "";
  }
  // ng finals with no vowel, e.g. cng1
  if (
    initial.endsWith("ng") &&
    initial.length > 2 &&
    medial == "" &&
    coda == ""
  ) {
    initial = initial.slice(0, -2);
    coda = "ng";
  }
  // Convert to PUJ + numeric tone
  if (initial in alldata[system].initialToPuj) {
    initial = alldata[system].initialToPuj[initial];
  } else {
    throw new Error("Initial not recognized: " + initial);
  }
  if (medial in alldata[system].medialToPuj) {
    medial = alldata[system].medialToPuj[medial];
  } else {
    throw new Error("Medial not recognized: " + medial);
  }
  if (coda in alldata[system].codaToPuj) {
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
    this.verbatimCase = checkCase(verbatim);
    if (verbatimSystem == "puj") {
      [this.initial, this.medial, this.coda, this.tonenumber] =
        parsePujSyllable(verbatim.toLowerCase());
    } else if (verbatimSystem == "pujn") {
      [this.initial, this.medial, this.coda, this.tonenumber] =
        parsePujnSyllable(verbatim.toLowerCase());
    } else if (["gdpi", "ggn", "dieghv"].includes(verbatimSystem)) {
      [this.initial, this.medial, this.coda, this.tonenumber] =
        parseGdpiLikeSyllable(verbatim.toLowerCase(), verbatimSystem);
    } else if (verbatimSystem == "fielde") {
      [this.initial, this.medial, this.coda, this.tonenumber] =
        parseFieldeSyllable(verbatim.toLowerCase());
    } else {
      throw new Error("Unsupported system " + verbatimSystem);
    }
  }

  returnIpa() {
    let nasal = false;
    let [initial, medial, coda] = [this.initial, this.medial, this.coda];
    if (this.coda.includes("ⁿ")) {
      nasal = true;
      coda = this.coda.replace("ⁿ", "");
    }
    if (initial in alldata["ipa"].initialFromPuj) {
      initial = alldata["ipa"].initialFromPuj[initial];
    } else {
      throw new Error("Initial not recognized: " + initial);
    }
    if (medial in alldata["ipa"].medialFromPuj) {
      if (nasal) {
        medial = "";
        for (let i = 0; i < this.medial.length; i++) {
          medial += this.medial[i] + String.fromCodePoint("0x0303");
        }
      } else {
        medial = alldata["ipa"].medialFromPuj[this.medial];
      }
    } else {
      throw new Error("Medial not recognized: " + medial);
    }
    if (coda in alldata["ipa"].codaFromPuj) {
      coda = alldata["ipa"].codaFromPuj[coda];
    } else {
      throw new Error("Coda not recognized: " + coda);
    }
    let toneletter = "";
    if (this.tonenumber in ipatones) {
      toneletter = ipatones[this.tonenumber];
    }
    return [initial, medial, coda, toneletter].join("");
  }

  returnPuj() {
    let toneless = [this.initial, this.medial, this.coda].join("");
    return addToneDiacriticPujLike(toneless, this.tonenumber, pujtones);
  }

  returnPujn(superscript = false) {
    let tonenumber = this.tonenumber;
    if (superscript) {
      tonenumber = superscriptnum[this.tonenumber];
    }
    return [this.initial, this.medial, this.coda, tonenumber].join("");
  }

  returnFielde() {
    let pujFinal = this.medial + this.coda;
    let fieldeInitial = "";
    let fieldeFinal = "";
    if (this.initial in alldata["fielde"].initialFromPuj) {
      fieldeInitial = alldata["fielde"].initialFromPuj[this.initial];
    } else {
      throw new Error("Initial not recognized: " + this.initial);
    }
    if (pujFinal in alldata["fielde"].finalFromPuj) {
      fieldeFinal = alldata["fielde"].finalFromPuj[pujFinal];
    } else {
      throw new Error("Final not recognized: " + pujFinal);
    }
    let toneless = fieldeInitial + fieldeFinal;
    return addToneDiacriticPujLike(toneless, this.tonenumber, fieldetones);
  }

  returnGdpiLike(system, superscript = false) {
    // GDPI-like systems
    let initial = "";
    let medial = "";
    let coda = "";
    if (this.initial in alldata[system].initialFromPuj) {
      initial = alldata[system].initialFromPuj[this.initial];
    } else {
      throw new Error("Initial not recognized: " + this.initial);
    }
    if (this.medial in alldata[system].medialFromPuj) {
      medial = alldata[system].medialFromPuj[this.medial];
    } else {
      throw new Error("Medial not recognized: " + this.medial);
    }
    if (this.coda in alldata[system].codaFromPuj) {
      coda = alldata[system].codaFromPuj[this.coda];
    } else {
      throw new Error("Coda not recognized: " + this.coda);
    }
    let tonenumber = this.tonenumber;
    if (superscript) {
      tonenumber = superscriptnum[this.tonenumber];
    }
    return [initial, medial, coda, tonenumber].join("");
  }

  convert(system, superscript) {
    let out = "";
    if (system == "puj") {
      out = this.returnPuj();
    } else if (system == "pujn") {
      out = this.returnPujn(superscript);
    } else if (["gdpi", "ggn", "dieghv"].includes(system)) {
      out = this.returnGdpiLike(system, superscript);
    } else if (system == "fielde") {
      out = this.returnFielde();
    } else if (system == "ipa") {
      out = this.returnIpa();
    } else {
      throw new Error("Unrecognized system " + system);
    }
    if (this.verbatimCase == "initial" && system != "ipa") {
      out = out[0].toUpperCase() + out.slice(1);
    } else if (this.verbatimCase == "upper" && system != "ipa") {
      out = out.toUpperCase();
    }
    return out;
  }
}

function addToneDiacriticPujLike(toneless, tonenumber, tonedata) {
  // Add tone diacritic according to orthographic rules
  let toneLetterIndex = -1;
  // Add diacritic on first vowel that is not i
  if (toneless.match(/[aeouo̤ṳw]/)) {
    toneLetterIndex = toneless.match(/[aeouṳo̤w]/).index;
  } else if (toneless.match(/i/)) {
    // Else on first i
    toneLetterIndex = toneless.match(/i/).index;
  } else if (toneless.match(/[nm]/)) {
    // Else on first n or m
    toneLetterIndex = toneless.match(/[nm]/).index;
  } else {
    throw new Error("Cannot place tone diacritic on " + toneless);
  }
  let pre = toneless.slice(0, toneLetterIndex + 1);
  let post = "";
  if (toneless.length > toneLetterIndex + 1) {
    post = toneless.slice(toneLetterIndex + 1);
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
function convertWord(
  word,
  from = "puj",
  to = "gdpi",
  superscript,
  invalidLeftDelim,
  invalidRightDelim,
  debug = false,
) {
  try {
    let syllable = new Syllable(word, from);
    if ( debug ) {
      console.log(syllable);
    }
    return syllable.convert(to, superscript);
  } catch (e) {
    console.error(e.name + ": " + e.message);
    return invalidLeftDelim + word + invalidRightDelim;
  }
}

// Apply conversion to entire line
function convertLine(
  line,
  from = "puj",
  to = "gdpi",
  superscript = false,
  invalidLeftDelim = "[",
  invalidRightDelim = "]",
  debug = false,
) {
  let result = [];
  let splitRe = /(\p{P}|\p{Z}|\n)/gu;
  let linesplit = line.split(splitRe);
  for (const word of linesplit) {
    if (word.match(splitRe)) {
      // punctuation or space only
      result.push(word);
    } else if (word.match(/^\d+$/)) {
      // numeral only
      result.push(word);
    } else if (word.length > 0) {
      result.push(
        convertWord(
          word,
          from,
          to,
          superscript,
          invalidLeftDelim,
          invalidRightDelim,
          debug,
        ),
      );
    }
  }
  return result.join("");
}

export { convertLine };
