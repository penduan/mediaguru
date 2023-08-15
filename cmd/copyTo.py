#!/usr/bin/env python

from subprocess import run
import sys
import shutil
import os

output = sys.argv[1]

result = run(['git', 'ls-files'], capture_output=True, text=True)

list = result.stdout.split("\n")

for item in list:
  if not item:
    continue
  if item == ".gitignore":
    continue

  dist_file = os.path.join(output, item)
  dist_folder = os.path.dirname(dist_file)

  os.makedirs(dist_folder, exist_ok=True)

  shutil.copy2(item, dist_file) 

