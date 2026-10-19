#!/usr/bin/env python3
"""Word-form frequencies from the cv.wikipedia dump (src/cvwiki.xml.bz2) -> src/cvwiki_freq.json (forms with count>=3) + src/cvwiki_cap.json (capitalised occurrences, to spot proper names).
Only counts are used (no text is shipped). Look-alike Latin letters are normalised (tools/cvnorm.py)."""
import bz2, collections, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from cvnorm import norm, TOK
import re
CAP = re.compile(r'(?<![а-яёӑӗҫӳА-ЯЁӐӖҪӲ])[А-ЯЁӐӖҪӲ][а-яёӑӗҫӳ]+')
S = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src')
c = collections.Counter(); cap = collections.Counter(); intext = False
with bz2.open(f'{S}/cvwiki.xml.bz2', 'rt', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if '<text' in line: intext = True
        if intext:
            t = norm(line); c.update(TOK.findall(t.lower()))
            cap.update(m.lower() for m in CAP.findall(t))
        if '</text>' in line: intext = False
json.dump({w: n for w, n in c.items() if n >= 3}, open(f'{S}/cvwiki_freq.json', 'w'), ensure_ascii=False)
json.dump({w: n for w, n in cap.items() if n >= 3}, open(f'{S}/cvwiki_cap.json', 'w'), ensure_ascii=False)
print('forms', len(c), 'kept', sum(1 for n in c.values() if n >= 3))
