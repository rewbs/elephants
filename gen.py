import json
import periodictable as pt

elements = []
for el in pt.elements:
    if el.number == 0:
        continue  # skip the dummy element
    # map categories to your naming convention
    print(el)

