
const numTokensVal = document.getElementById("num-tokens-value");
const topPVal = document.getElementById("top-p-value");
const temperatureVal = document.getElementById("temperature-value");

const numTokensSlider = document.getElementById("num-tokens-slider");
const topPSlider = document.getElementById("top-p-slider");
const temperatureValSlider = document.getElementById("temperature-slider");

const textField = document.getElementById("text-field");
const generateBtn = document.getElementById("generate-btn");


generateBtn.onclick = () => {show_generated_text()}

function show_generated_text() {
    fetch('/generate', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputText: textField.value
        })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            result_text = document.getElementById('result-text');
            result_text.textContent = `Generated text: ${data.result}`;
        });
}
