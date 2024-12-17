import { convertLine } from "./src/pengim.js";

// first button element
let button1 = document.getElementById("topuj_button");

button1.addEventListener("click", function() {
  let input = document.getElementById("input").value;
  let system = document.querySelector('input[name="system"]:checked').value;
  let convertedLine = convertLine(input, "toPuj", system);
  console.log(convertedLine);
  document.getElementById("outputdiv").innerHTML = convertedLine;
});

// second button element
let button2 = document.getElementById("frompuj_button");

button2.addEventListener("click", function() {
  let input = document.getElementById("input").value;
  let system = document.querySelector('input[name="system"]:checked').value;
  let convertedLine = convertLine(input, "fromPuj", system);
  document.getElementById("outputdiv").innerHTML = convertedLine;
});
