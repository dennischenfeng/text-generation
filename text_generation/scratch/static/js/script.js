
const numTokensVal = document.getElementById("num-tokens-value");
const topPVal = document.getElementById("top-p-value");
const temperatureVal = document.getElementById("temperature-value");

const numTokensSlider = document.getElementById("num-tokens-slider");
const topPSlider = document.getElementById("top-p-slider");
const temperatureSlider = document.getElementById("temperature-slider");

const textField = document.getElementById("text-field");
const generateBtn = document.getElementById("generate-btn");

numTokensSlider.onmousemove = (e) => {
    numTokensVal.textContent = `${e.target.value}`;
}
topPSlider.onmousemove = (e) => {
    topPVal.textContent = `${e.target.value}`;
}
temperatureSlider.onmousemove = (e) => {
    temperatureVal.textContent = `${e.target.value}`;
}
generateBtn.onclick = () => {show_generated_text()}

function show_generated_text() {
    fetch('/generate', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputText: textField.value,
            numTokens: parseInt(numTokensVal.textContent),
            topP: parseFloat(topPVal.textContent),
            temperature: parseFloat(temperatureVal.textContent),
        })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            textField.value = `${textField.value}${data.result}`
        });
}
