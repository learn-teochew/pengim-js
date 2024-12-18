import { convertLine } from "./src/pengim.js";

// first button element
let button = document.getElementById("convertbutton");

button.addEventListener("click", function() {
  let input = document.getElementById("input").value;
  let inputsystem = document.querySelector('input[name="inputsystem"]:checked').value;
  let outputsystem = document.querySelector('input[name="outputsystem"]:checked').value;
  // Highlight invalid input syllables in red
  let convertedLine = convertLine(input, inputsystem, outputsystem, '<span style="color:red;">', '</span>');
  console.log(convertedLine);
  document.getElementById("outputdiv").innerHTML = convertedLine;
});
