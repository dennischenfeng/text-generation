"""
Flask app for text generation.
"""
from definitions import ROOT_DIR
from flask import Flask, render_template, jsonify, request
from onnxruntime import InferenceSession
from transformers import AutoTokenizer
from text_generation.inference import generate_new_tokens


app = Flask(__name__)
application = app  # TODO: remove the need to rename this
session = InferenceSession(
    str(ROOT_DIR / "models/distilgpt2_onArxivMLData_quantized.onnx")
)
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    init_text = request.json['inputText']
    init_ids = tokenizer(init_text, return_tensors="np")["input_ids"]
    max_consume_tokens = 30  # TODO: change to 50 after modified onnx file
    num_new_tokens = 30
    new_ids = generate_new_tokens(
        num_new_tokens=num_new_tokens,
        init_ids=init_ids,
        max_consume_tokens=max_consume_tokens,
        session=session,
        temperature=1.0,
        top_p=1.0,
    )
    new_text = tokenizer.decode(new_ids[0, :])
    return jsonify({'result': new_text})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)

