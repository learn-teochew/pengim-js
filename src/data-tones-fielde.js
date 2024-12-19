export const toneCodeToNumber = {
  0x301 : 2,
  0x300 : 3,
  0x302 : 58, // Ambiguous, depends on coda
  0x306 : 6,
  0x30C : 6,
  0x304 : 7,
  0x305 : 7,
};

export const toneNumberToCode = {
  2 : 0x301 ,
  3 : 0x300 ,
  5 : 0x302 ,
  6 : 0x306 ,
  7 : 0x304 ,
  8 : 0x302
};
