"""
Test inference.py
"""
import pytest
import numpy as np
from numpy.testing import assert_allclose
from definitions import ROOT_DIR
from pathlib import Path
from transformers import AutoTokenizer
from text_generation.inference import sample_token_id_from_logits, generate_new_tokens, softmax
from onnxruntime import InferenceSession


@pytest.fixture(scope="function")
def tokenizer():
    return AutoTokenizer.from_pretrained("distilgpt2")


@pytest.fixture(scope="function")
def inference_session():
    model_path = ROOT_DIR / "models/distilgpt2_onArxivMLData_quantized.onnx"
    return InferenceSession(str(model_path))


def test_generate_new_tokens(inference_session):
    np.random.seed(0)
    for num_new_tokens in range(1,5):
        new_ids = generate_new_tokens(
            num_new_tokens=num_new_tokens,
            init_ids=np.array([[7, 200, 53, 10]]),
            max_consume_tokens=3,
            session=inference_session,
            temperature=1.0,
            top_p=1.0,
        )
        assert new_ids.shape == (1, num_new_tokens)
    # TODO: how to test randomness?


def test_sample_token_id_from_logits():
    np.random.seed(0)
    assert sample_token_id_from_logits(np.array([-30.1, -40.0, -35.5])) in [0, 1, 2]
    # TODO: how to test randomness?    


def test_softmax():
    assert_allclose(softmax(np.array([10, 10])), 0.5)
    assert_allclose(softmax(np.array([10, 10, 10, 10])), 0.25)
    assert_allclose(
        softmax(np.array([10, -1, 5, 7])),
        np.array([9.4648e-01, 1.5808e-05, 6.3774e-03, 4.7123e-02]),
        rtol=1e-4,
    )
    