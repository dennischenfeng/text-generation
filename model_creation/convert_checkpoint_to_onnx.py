"""Script to convert hugging face model to onnx, and save it."""

import gzip
import json
from typing import Callable, List, Tuple, Iterable, Dict, Type, Any
from functools import reduce, lru_cache
from collections import OrderedDict
import inspect
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

matplotlib.rcParams["figure.facecolor"] = "white"
from tqdm import tqdm
import torch as th
import torch.nn.functional as F
from torch import nn
from torch import optim
from torch.nn import Embedding
from torch.utils.data import DataLoader, random_split
import pytorch_lightning as pl
from pytorch_lightning import Trainer
from pytorch_lightning.loggers import TensorBoardLogger, WandbLogger
from torchmetrics import MeanSquaredError
import wandb
from transformers import (
    AutoTokenizer,
    DataCollatorForLanguageModeling,
    AutoModelForCausalLM,
    AdamW,
    get_linear_schedule_with_warmup,
    # GPT2LMHeadModel,
    AutoConfig,
    pipeline,
)
from datasets import load_dataset, DatasetDict, Dataset
from typing import OrderedDict
from transformers.models.gpt2 import GPT2OnnxConfig
from pathlib import Path
from transformers.onnx import export, validate_model_outputs
import onnx
from typing import OrderedDict
from transformers.models.gpt2 import GPT2OnnxConfig
from pathlib import Path
from transformers.onnx import export, validate_model_outputs
from onnxruntime.quantization import QuantizationMode, quantize
import onnx
from pathlib import Path

FILE_DIR = Path(__file__).parent.absolute()


# define pt model vefore loading
class LitCausalLMModel(pl.LightningModule):
    def __init__(
        self,
        hf_model_name: str,
        total_steps: int,
        lr: float = 5e-5,
        weight_decay: float = 0.01,
        adam_epsilon: float = 1e-6,
        warmup_steps: int = 1000,
    ) -> None:
        super().__init__()
        self.hf_model = AutoModelForCausalLM.from_pretrained(hf_model_name)
        self.save_hyperparameters()

    def forward(self, **inputs):
        outputs = self.hf_model(**inputs)
        return outputs

    def training_step(self, batch: th.Tensor, batch_idx: int):
        outputs = self(**batch)
        loss = outputs.loss
        self.log("train_loss", loss)
        return loss

    def validation_step(self, batch: th.Tensor, batch_idx: int):
        outputs = self(**batch)
        loss = outputs.loss
        self.log("val_loss", loss)
        return loss

    def validation_epoch_end(self, outputs):
        # visualize the output
        pipe = pipeline(
            "text-generation", model=self.hf_model, tokenizer=tokenizer, device=0
        )
        txt = "We develop a method to"
        gen_text = pipe(txt, num_return_sequences=1)[0]["generated_text"]
        # self.wandb_table.add_data(self.global_step, gen_text)
        # wandb.log({"generated_text": self.wandb_table})
        # self.logger.log_table({"generated_text": self.wandb_table})
        print(gen_text)

    def configure_optimizers(self):
        model = self.hf_model
        no_decay = ["bias", "LayerNorm.weight"]
        optimizer_grouped_parameters = [
            {
                "params": [
                    p
                    for n, p in self.hf_model.named_parameters()
                    if not any(nd in n for nd in no_decay)
                ],
                "weight_decay": self.hparams.weight_decay,
            },
            {
                "params": [
                    p
                    for n, p in self.hf_model.named_parameters()
                    if any(nd in n for nd in no_decay)
                ],
                "weight_decay": 0.0,
            },
        ]
        optimizer = AdamW(
            optimizer_grouped_parameters,
            lr=self.hparams.lr,
            eps=self.hparams.adam_epsilon,
        )

        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=self.hparams.warmup_steps,
            num_training_steps=self.hparams.total_steps,
        )
        scheduler = {"scheduler": scheduler, "interval": "step", "frequency": 1}
        return [optimizer], [scheduler]


# load pt and hf model
pt_model = LitCausalLMModel("distilgpt2", total_steps=1, lr=1e-4)
checkpoint = th.load(
    FILE_DIR / "../models/pytorch/model.ckpt",
    map_location=th.device("cpu"),
)
pt_model.load_state_dict(checkpoint["state_dict"])
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")

model = pt_model.hf_model
model.save_pretrained(FILE_DIR / "../models/huggingface/")
tokenizer.save_pretrained(FILE_DIR / "../models/huggingface/")

# convert hf to onnx model
onnx_config = GPT2OnnxConfig(model.config, task="causal-lm")
onnx_config.default_onnx_opset
print("onnx_config.outputs:")
print(onnx_config.outputs)
onnx_path = FILE_DIR / Path("../models/onnx/model.onnx")
onnx_inputs, onnx_outputs = export(
    tokenizer, model, onnx_config, onnx_config.default_onnx_opset, onnx_path
)
print("onnx_inputs:")
print(onnx_inputs)

print("onnx_outputs:")
print(onnx_outputs)

# load and validate onnx model
onnx_model = onnx.load(onnx_path)
onnx.checker.check_model(onnx_model)
validate_model_outputs(
    onnx_config,
    tokenizer,
    model,
    onnx_path,
    onnx_outputs,
    onnx_config.atol_for_validation,
)

# quantize and save onnx model
onnx_model = onnx.load(FILE_DIR / "../models/onnx/model.onnx")
quantized_onnx_model = quantize(
    model=onnx_model,
    quantization_mode=QuantizationMode.IntegerOps,
    force_fusions=True,
    symmetric_weight=True,
)
onnx.save_model(quantized_onnx_model, FILE_DIR / "../models/onnx/model_quantized.onnx")
