export const syllableRe = /^([^aêeiou\d]*)([aêeiou]*)([hbgmn]*)([012345678]*)$/;

export const initialFromPuj = {
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

export const medialFromPuj = {
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

export const codaFromPuj = {
  ""   : ""  ,
  "h"  : "h" ,
  "p"  : "b" ,
  "m"  : "m" ,
  "n"  : "ng",
  "ng" : "ng",
  "ngh" : "ngh",
  "t"  : "g" ,
  "k"  : "g" ,
  "ⁿ"  : "n" ,
  "ⁿh" : "nh"
}

export const initialToPuj = {
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

export const medialToPuj = {
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

export const codaToPuj = {
  ""  : ""   ,
  "h" : "h"  ,
  "b" : "p"  ,
  "m" : "m"  ,
  "ng": "ng" ,
  "ngh": "ngh" ,
  "g" : "k"  ,
  "n" : "ⁿ"  ,
  "nh": "ⁿh" 
}
