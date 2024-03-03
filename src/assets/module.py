import json
import os

json_folder = '../json_files'
json_file_name = 'words.json'

json_folder_path = os.path.join(json_folder)
os.makedirs(json_folder_path, exist_ok=True)

json_file_path = os.path.join(json_folder_path, json_file_name)

with open('words.txt', 'r') as file:
    words = file.read().splitlines()

data = {'items': words}

with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=4)

