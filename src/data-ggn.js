export const syllableRe = /^([^aeiou\d]*)([aeiou]*)([hpkmng]*)([012345678]*)$/;

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
  "ts"  : "j" ,
  "ch"  : "j" ,
  "tsh" : "ch" ,
  "chh" : "ch" ,
  "s"   : "s" ,
  "z"   : "y" ,
  "j"   : "y" ,
  "dz"  : "y" ,
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
  "ṳ"   : "eu"  ,
  "ai"  : "ai" ,
  "oi"  : "oi" ,
  "ei"  : "ei" ,
  "au"  : "ao" ,
  "ou"  : "ou" ,
  "i"   : "i"  ,
  "ia"  : "ia" ,
  "io"  : "io" ,
  "ie"  : "ie" ,
  "iou" : "iou",
  "ieu" : "ieu",
  "iau" : "iao",
  "iu"  : "iu" ,
  "u"   : "u"  ,
  "ua"  : "ua" ,
  "ue"  : "ue" ,
  "uai" : "uai",
  "uei" : "uei",
  "ui"  : "ui"
}

export const codaFromPuj = {
  ""   : ""  ,
  "h"  : "h" ,
  "p"  : "p" ,
  "m"  : "m" ,
  "n"  : "ng",
  "ng" : "ng",
  "t"  : "t" ,
  "k"  : "k" ,
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
  "j" : "ts"  ,
  "ch" : "tsh" ,
  "s" : "s"   ,
  "y" : "j"   ,
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
  "eu"  : "ṳ"   ,
  "ai" : "ai"  ,
  "oi" : "oi"  ,
  "ei" : "ei"  ,
  "ao" : "au"  ,
  "ou" : "ou"  ,
  "i"  : "i"   ,
  "ia" : "ia"  ,
  "io" : "io"  ,
  "ie" : "ie"  ,
  "iou": "iou" ,
  "ieu": "ieu" ,
  "iao": "iau" ,
  "iu" : "iu"  ,
  "u"  : "u"   ,
  "ua" : "ua"  ,
  "ue" : "ue"  ,
  "uai": "uai" ,
  "uei": "uei" ,
  "ui" : "ui"  
}

export const codaToPuj = {
  ""  : ""   ,
  "h" : "h"  ,
  "p" : "p"  ,
  "m" : "m"  ,
  "ng": "ng" ,
  "k" : "k"  ,
  "t" : "t"  ,
  "n" : "ⁿ"  ,
  "nh": "ⁿh" 
}
