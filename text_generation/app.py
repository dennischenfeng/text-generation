"""
Flask app for text generation.
"""
from definitions import ROOT_DIR
from flask import Flask, render_template, jsonify, request
from onnxruntime import InferenceSession
from transformers import AutoTokenizer
from text_generation.inference import generate_new_tokens
import time


app = Flask(__name__)
application = app  # TODO: remove the need to rename this
session = InferenceSession(
    str(ROOT_DIR / "models/distilgpt2_onArxivMLData_quantized.onnx")
)
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")


@app.route('/')
def index():
    return render_template('index.html')

# TODO: test
@app.route('/time')
def hello():
    return {"result": time.time()}

@app.route('/generate', methods=['POST'])
def generate():
    request_dict = request.json
    init_ids = tokenizer(request_dict["inputText"], return_tensors="np")["input_ids"]
    max_consume_tokens = 50
    new_ids = generate_new_tokens(
        num_new_tokens=request_dict["numTokens"],
        init_ids=init_ids,
        max_consume_tokens=max_consume_tokens,
        session=session,
        top_p=request_dict["topP"],
        temperature=request_dict["temperature"],
    )
    new_text = tokenizer.decode(new_ids[0, :])
    return jsonify({'result': new_text})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)

