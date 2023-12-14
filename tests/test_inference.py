"""
Test inference.py
"""
import pytest
import numpy as np
from numpy.testing import assert_allclose
from definitions import ROOT_DIR
from pathlib import Path
from transformers import AutoTokenizer
from text_generation.inference import (
    sample_token_id_from_logits,
    generate_new_tokens,
    softmax,
    warp_logits_with_top_p_filtering,
)
from onnxruntime import InferenceSession


@pytest.fixture(scope="function")
def tokenizer():
    return AutoTokenizer.from_pretrained("distilgpt2")


@pytest.fixture(scope="function")
def inference_session():
    model_path = ROOT_DIR / "models/final_onnx/quantized_model.onnx"
    return InferenceSession(str(model_path))


def test_generate_new_tokens(inference_session):
    np.random.seed(0)
    for num_new_tokens in range(1, 5):
        new_ids = generate_new_tokens(
            num_new_tokens,
            np.array([[7, 200, 53, 10]]),
            3,
            inference_session,
        )
        assert new_ids.shape == (1, num_new_tokens)
    # TODO: how to test randomness?


def test_sample_token_id_from_logits():
    np.random.seed(0)
    assert sample_token_id_from_logits(np.array([-30.1, -40.0, -35.5])) in [0, 1, 2]
    # TODO: how to test randomness?


def test_warp_logits_with_top_p_filtering():
    logits = np.array([-5.0, -2.0, -1.0, -3.0, -4.0])

    warped_logits = warp_logits_with_top_p_filtering(logits)
    assert np.sum(warped_logits == -float("inf")) == 0

    warped_logits = warp_logits_with_top_p_filtering(logits, top_p=0.95)
    assert np.sum(warped_logits == -float("inf")) == 2

    warped_logits = warp_logits_with_top_p_filtering(logits, top_p=0.85)
    assert np.sum(warped_logits == -float("inf")) == 3

    warped_logits = warp_logits_with_top_p_filtering(logits, top_p=0.60)
    assert np.sum(warped_logits == -float("inf")) == 4


def test_softmax():
    assert_allclose(softmax(np.array([10, 10])), 0.5)
    assert_allclose(softmax(np.array([10, 10, 10, 10])), 0.25)
    assert_allclose(
        softmax(np.array([10, -1, 5, 7])),
        np.array([9.4648e-01, 1.5808e-05, 6.3774e-03, 4.7123e-02]),
        rtol=1e-4,
    )
