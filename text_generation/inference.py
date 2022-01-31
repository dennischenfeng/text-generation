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
    temperature: float = 1.0, 
    top_p: float = 1.0,
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
        sampled_token_id = sample_token_id_from_logits(last_token_logits, temperature, top_p)
        input_ids = np.append(input_ids, sampled_token_id)  # flattens input_ids automatically
        input_ids = eo.rearrange(input_ids, "i -> 1 i")
    
    new_ids = input_ids[:, num_consume_tokens:]
    return new_ids


def sample_token_id_from_logits(
    logits: np.ndarray, temperature: float = 1.0, top_p: float = 1.0
) -> int:
    """
    Given a 1D array of logits, sample the ID, including temperature and top_p features.
    """
    if len(logits.shape) != 1:
        raise ValueError("`logits` must be 1D.")
    print("warning: currently ignoring temperature and top_p")
    return np.argmax(logits)

# def warp_logits_with_temperature(
#     logits: np.ndarray, temperature: float = 1.0
# ) -> np.ndarray:
#     """
#     Based from transformers.TemperatureLogitsWarper implementation. 
#     """
#     return logits / temperature

# def warp_logits_with_top_p_filtering(
#     logits: np.ndarray, top_p: float = 1.0
# ) -> np.ndarray:
#     sorted_indices = np.argsort(logits)[::-1]
#     sorted_logits = logits[sorted_indices]
#     cumulative_probs = sorted_logits.softmax(dim=-1).cumsum(dim=-1)

#     # Remove tokens with cumulative top_p above the threshold (token with 0 are kept)
#     sorted_indices_to_remove = cumulative_probs > self.top_p
#     if self.min_tokens_to_keep > 1:
#         # Keep at least min_tokens_to_keep (set to min_tokens_to_keep-1 because we add the first one below)
#         sorted_indices_to_remove[..., : self.min_tokens_to_keep - 1] = 0
#     # Shift the indices to the right to keep also the first token above the threshold
#     sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
#     sorted_indices_to_remove[..., 0] = 0

#     # scatter sorted tensors to original indexing
#     indices_to_remove = sorted_indices_to_remove.scatter(1, sorted_indices, sorted_indices_to_remove)
#     scores = scores.masked_fill(indices_to_remove, self.filter_value)
#     return scores

# def softmax(
#     logits: np.ndarray
# ):


#     y = np.exp(x - np.max(x))
#     f_x = y / np.sum(np.exp(x))
#     return f_x