import { convertLine } from "./src/pengim.js";

// Get the textarea elements
let textarea1 = document.getElementById("input");
let textarea2 = document.getElementById("output");

// first button element
let button1 = document.getElementById("gdpi2puj_button");

button1.addEventListener("click", function() {
  let input = textarea1.value;
  let convertedLine = convertLine(input, "toPuj", "gdpi");
  textarea2.value = convertedLine;
});

// second button element
let button2 = document.getElementById("puj2gdpi_button");

button2.addEventListener("click", function() {
  let input = textarea1.value;
  let convertedLine = convertLine(input, "fromPuj", "gdpi");
  textarea2.value = convertedLine;
});
