import { convertLine } from "./src.js";

// Get the textarea elements
let textarea = document.getElementById("input");
let output = document.getElementById("output");

// first button element
let button1 = document.getElementById("gdpi2puj_button");

button1.addEventListener("click", function() {
  let input = textarea.value;
  let convertedLine = convertLine(input, "gdpi2puj");
  output.value = convertedLine;
});

// second button element
let button2 = document.getElementById("puj2gdpi_button");

button2.addEventListener("click", function() {
  let input = textarea.value;
  let convertedLine = convertLine(input, "puj2gdpi");
  output.value = convertedLine;
});
