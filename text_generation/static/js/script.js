function show_generated_text() {
    fetch('/generate', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputText: document.getElementById('input-text-box').value
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