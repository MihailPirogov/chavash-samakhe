#!/usr/bin/env python3
"""Stage generated chapter photos: tools/stage_bg.py <hashprefix>=<NN> ... -> src/bg_stage/chNN.jpg (1280x720)
and back up the original to the bot store (chuvash-wow-bg-backup/chNN.jpg)."""
import sys, os, glob, shutil
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = '/cursor/stores/store-d8ae9b6a-d42b-48c7-a25a-fa68431613b1/grok-bot/agents/13177d38-ebc9-4438-a919-9b196a476bb2/attachments'
BK = '/cursor/stores/store-d8ae9b6a-d42b-48c7-a25a-fa68431613b1/chuvash-wow-bg-backup'
os.makedirs(BK, exist_ok=True); os.makedirs(f'{ROOT}/src/bg_stage', exist_ok=True)
for a in sys.argv[1:]:
    h, n = a.split('='); f = glob.glob(f'{GEN}/{h}*.jpg'); assert len(f) == 1, a
    im = Image.open(f[0]).convert('RGB')
    if im.size != (1280, 720): im = im.resize((1280, 720), Image.LANCZOS)
    im.save(f'{ROOT}/src/bg_stage/ch{int(n):02d}.jpg', quality=95)
    shutil.copyfile(f[0], f'{BK}/ch{int(n):02d}.jpg')
    print('staged', n, os.path.basename(f[0])[:12])
