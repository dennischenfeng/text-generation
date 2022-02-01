"""
Inference utility functions
"""
import numpy as np
import einops as eo
from onnxruntime import InferenceSession


def generate_new_tokens(
    num_new_tokens: int,
    init_ids: np.ndarray, 
    max_consume_tokens: int,
    session: InferenceSession,
    top_p: float = 1.0,
    temperature: float = 1.0, 
):
    """
    Assumes output_names for onnx model is ["logits"]
    :param init_ids: 2d ndarray with shape (batch_size, sequence_length). We assume batch_size=1.

    """
    if len(init_ids.shape) != 2 or init_ids.shape[0] != 1:
        raise ValueError("Batch size of input must be 1.")

    num_consume_tokens = min(init_ids.shape[-1], max_consume_tokens)
    input_ids = init_ids[:, -num_consume_tokens:]

    for _ in range(num_new_tokens):
        input_feed = dict(
            input_ids = input_ids,
            attention_mask = np.ones((1, input_ids.shape[-1]), dtype=int),
        )
        output_logits = session.run(output_names=['logits'], input_feed=input_feed)
        last_token_logits = output_logits[0][0, -1, :]
        sampled_token_id = sample_token_id_from_logits(last_token_logits, top_p, temperature)
        input_ids = np.append(input_ids, sampled_token_id)  # flattens input_ids automatically
        input_ids = eo.rearrange(input_ids, "i -> 1 i")
    
    new_ids = input_ids[:, num_consume_tokens:]
    return new_ids


def sample_token_id_from_logits(
    logits: np.ndarray, top_p: float = 1.0, temperature: float = 1.0
) -> int:
    """
    Given a 1D array of logits, sample the ID, including temperature and top_p features.
    """
    if len(logits.shape) != 1:
        raise ValueError("`logits` must be 1D.")
    # return np.argmax(logits)
    logits = warp_logits_with_top_p_filtering(logits, top_p=top_p)
    logits = warp_logits_with_temperature(logits, temperature=temperature)
    probs = softmax(logits)
    token_id = np.random.choice(range(len(probs)), p=probs)
    return token_id


def warp_logits_with_top_p_filtering(
    logits: np.ndarray, top_p: float = 1.0, min_tokens_to_keep: int = 1
) -> np.ndarray:
    """
    Based from transformers.TemperatureLogitsWarper implementation. 
    """
    if len(logits.shape) != 1:
        raise ValueError("`logits` must be 1D.")
    sorted_indices = np.argsort(logits)[::-1]
    sorted_logits = logits[sorted_indices]
    cumulative_probs = np.cumsum(softmax(sorted_logits))

    mask_sorted_indices_to_remove = cumulative_probs > top_p
    # keep the first token above the threshold
    ind_first_token_above = np.sum(mask_sorted_indices_to_remove == False)
    if ind_first_token_above < logits.shape[0]:
        mask_sorted_indices_to_remove[ind_first_token_above] = False

    if min_tokens_to_keep > 1:
        mask_sorted_indices_to_remove[:min_tokens_to_keep] = False
    
    mask_indices_to_remove = np.full(mask_sorted_indices_to_remove.shape, False)
    mask_indices_to_remove.put(sorted_indices, mask_sorted_indices_to_remove)
    print(f"top_p = {top_p}; num tokens kept from top-p: {np.sum(mask_indices_to_remove == False)}")
    warped_logits = logits.copy()
    np.putmask(warped_logits, mask_indices_to_remove, -float("inf"))
    return warped_logits


def warp_logits_with_temperature(
    logits: np.ndarray, temperature: float = 1.0
) -> np.ndarray:
    """
    Based from transformers.TemperatureLogitsWarper implementation. 
    """
    if len(logits.shape) != 1:
        raise ValueError("`logits` must be 1D.")
    return logits / temperature


def softmax(
    logits: np.ndarray,
) -> np.ndarray:
    """
    Apply softmax function to logits array. Need to implement this instead of using scipy or 
    pytorch because those packages are too large for deployment.
    """
    # translation of logits doesn't affect computed probabilities, but will improve numerical stability
    logits = logits - np.max(logits)
    unnormed_probs = np.exp(logits)
    normed_probs = unnormed_probs / np.sum(unnormed_probs)
    return normed_probs

