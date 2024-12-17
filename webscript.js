import { convertLine } from "./src/pengim.js";

// Get the textarea elements
let textarea1 = document.getElementById("input");
let textarea2 = document.getElementById("output");

// first button element
let button1 = document.getElementById("topuj_button");

button1.addEventListener("click", function() {
  let input = textarea1.value;
  let system = document.querySelector('input[name="system"]:checked').value;
  let convertedLine = convertLine(input, "toPuj", system);
  textarea2.value = convertedLine;
});

// second button element
let button2 = document.getElementById("frompuj_button");

button2.addEventListener("click", function() {
  let input = textarea1.value;
  let system = document.querySelector('input[name="system"]:checked').value;
  let convertedLine = convertLine(input, "fromPuj", system);
  textarea2.value = convertedLine;
});
