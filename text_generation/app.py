from flask import Flask, render_template, jsonify, request
from onnxruntime import InferenceSession
from transformers import AutoTokenizer

app = Flask(__name__)
session = InferenceSession("models/distilgpt2_onArxivMLData_quantized.onnx")
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    input_text = request.json['inputText']
    return jsonify({'result': 1.0})
    
@app.route('/test', methods=['POST'])
def test():
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)

application = app