export const syllableRe = /^([^aveiou\d]*)([aveiou]*)([hpkmng]*)([012345678]*)$/;

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
  "e"   : "e"  ,
  "ṳ"   : "v"  ,
  "ai"  : "ai" ,
  "oi"  : "oi" ,
  "ei"  : "ei" ,
  "au"  : "au" ,
  "ou"  : "ou" ,
  "i"   : "i"  ,
  "ia"  : "ia" ,
  "io"  : "io" ,
  "ie"  : "ie" ,
  "iou" : "iou",
  "ieu" : "ieu",
  "iau" : "iau",
  "iu"  : "iu" ,
  "u"   : "u"  ,
  "ua"  : "ua" ,
  "ue"  : "ue" ,
  "uai" : "uai",
  "uei" : "uei",
  "ui"  : "ui"
}

export const codaFromPuj = {
  ""   : ""   ,
  "h"  : "h"  ,
  "p"  : "p"  ,
  "m"  : "m"  ,
  "n"  : "ng" ,
  "ng" : "ng" ,
  "ngh": "ngh",
  "t"  : "k"  ,
  "k"  : "k"  ,
  "ⁿ"  : "n"  ,
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
  "e"  : "e"   ,
  "v"  : "ṳ"   ,
  "ai" : "ai"  ,
  "oi" : "oi"  ,
  "ei" : "ei"  ,
  "au" : "au"  ,
  "ou" : "ou"  ,
  "i"  : "i"   ,
  "ia" : "ia"  ,
  "io" : "io"  ,
  "ie" : "ie"  ,
  "iou": "iou" ,
  "ieu": "ieu" ,
  "iau": "iau" ,
  "iu" : "iu"  ,
  "u"  : "u"   ,
  "ua" : "ua"  ,
  "ue" : "ue"  ,
  "uai": "uai" ,
  "uei": "uei" ,
  "ui" : "ui"  
}

export const codaToPuj = {
  ""   : ""   ,
  "h"  : "h"  ,
  "p"  : "p"  ,
  "m"  : "m"  ,
  "ngh": "ngh",
  "k"  : "k"  ,
  "n"  : "ⁿ"  ,
  "nh" : "ⁿh" 
}
