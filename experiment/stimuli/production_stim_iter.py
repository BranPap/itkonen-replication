import json
import pandas as pd

df = pd.read_csv("experiment/stimuli/stimuli.csv")

entries = []

entry_keys = []

for index,row in df.iterrows():
    final_dict = dict()
    final_dict["item"] = row["item"]
    final_dict["type"] = row["type"]
    final_dict["voice"] = row["voice"]
    final_dict["sentence"] = row["sentence"]
    options = []
    options.append(row["nom"])
    options.append(row["gen"])
    final_dict["options"] = options
    entries.append(final_dict)

with open('experiment/stimuli/itkonen-stims.js', 'w') as stimlist:
    s = json.dumps(entries, indent=4)
    stimlist.write("var all_stims = ")
    stimlist.write(s)
