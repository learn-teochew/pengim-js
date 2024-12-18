import { convertLine } from "./src/pengim.js";

// first button element
let button1 = document.getElementById("topuj_button");

button1.addEventListener("click", function() {
  let input = document.getElementById("input").value;
  let system = document.querySelector('input[name="system"]:checked').value;
  // Highlight invalid input syllables in red
  let convertedLine = convertLine(input, system, 'puj', '<span style="color:red;">', '</span>');
  console.log(convertedLine);
  document.getElementById("outputdiv").innerHTML = convertedLine;
});

// second button element
let button2 = document.getElementById("frompuj_button");

button2.addEventListener("click", function() {
  let input = document.getElementById("input").value;
  let system = document.querySelector('input[name="system"]:checked').value;
  // Highlight invalid input syllables in red
  let convertedLine = convertLine(input, "puj", system, '<span style="color:red;">', '</span>');
  document.getElementById("outputdiv").innerHTML = convertedLine;
});
