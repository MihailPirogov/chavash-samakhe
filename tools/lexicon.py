#!/usr/bin/env python3
"""Chuvash lexicon + crossword layout for the Chuvash word game «Чӑваш сӑмахӗ» (imported by build_game.py).
Sources (in src/, see SOURCES.md):
  ru_cv.jsonl      - Chuvash entries of the Russian Wiktionary (ru.wiktionary.org), extracted by Wiktextract / kaikki.org.
                     CC BY-SA 4.0 (+GFDL). Headwords, Russian translations, examples. Main source of shipped glosses/cards.
  en_cv.jsonl      - Chuvash entries of the English Wiktionary (kaikki.org), CC BY-SA 4.0: extra headwords, plural forms, English fallback gloss.
  cvwiki_freq.json - word-form counts from the cv.wikipedia dump (tools/cvwiki_freq.py); only numbers are used.
  hunspell/cv_RU.dic - Chuvash hunspell dictionary (hunspell.chv.su, GPL-3.0+ / LGPL-3.0+ / MPL-1.1): used ONLY to validate
                     extra bonus words that are also frequent in cv.wikipedia (USE_HUNSPELL=0 switches it off).
All text is normalised by cvnorm.norm (Latin ă ĕ ç ÿ -> Cyrillic ӑ ӗ ҫ ӳ)."""
import json, re, random, collections, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = f'{ROOT}/src'; T = f'{ROOT}/tools'; OUT = ROOT
sys.path.insert(0, T)
from religion_filter import religious, offensive
from cvnorm import norm
random.seed(42)
freq = json.load(open(f'{S}/cvwiki_freq.json'))
capf = json.load(open(f'{S}/cvwiki_cap.json')) if os.path.exists(f'{S}/cvwiki_cap.json') else {}
def mostly_capitalised(w): return capf.get(w, 0) > 0.45 * max(1, freq.get(w, 0))   # proper names, abbreviations
LET = re.compile(r'^[а-яёӑӗҫӳ]{3,8}$')
LOAN_LET = re.compile(r'[цщёфъ]')            # letters found almost only in Russian loans
POS_RU = {'noun': 'сущ.', 'verb': 'гл.', 'adj': 'прил.', 'adv': 'нареч.', 'num': 'числ.', 'pron': 'мест.', 'unknown': ''}
SPECIAL = ('хим.', 'мед.', 'физ.', 'анат.', 'лингв.', 'книжн.', 'диал.', 'матем.', 'истор.', 'техн.', 'биол.', 'астрон.', 'филол.', 'филос.',
           'биохим.', 'геол.', 'спец.', 'физиол.', 'грам.', 'экон.', 'юр.', 'минер.', 'комп.', 'устар.', 'редк.', 'прост.', 'сл.', 'полит.', 'воен.',
           'геометр.', 'информ.', 'полигр.', 'рег.', 'генет.', 'металл.', 'фин.', 'эл.', 'опт.', 'шахм.', 'этногр.')
LAB_RE = re.compile(r'^((?:[а-яёА-Я]+\.\s*)+)')
REF_RE = re.compile(r'^(?:см\.|то же,? что|словоформа|форма|мн\. ч\.)', re.I)
LOAN_ETY = re.compile(r'(?:русск|лат\.|греч|франц|англ|нем\.|итал|Заимствовано из русского)')

def split_label(g):
    m = LAB_RE.match(g)
    if not m: return '', g.strip()
    lab = m.group(1).strip()
    if lab in ('см.',): return '', g.strip()
    return lab, g[m.end():].strip()

def clean_gloss(g):
    g = re.sub(r'\s*\(аналогично русскому слову\)', '', g)
    return re.sub(r'\s+', ' ', g).strip(' ;,')

# ---------- read the Russian Wiktionary ----------
entries = collections.defaultdict(list)    # headword -> list of entry dicts (homonyms)
form_of = {}                               # inflected form -> lemma
for l in open(f'{S}/ru_cv.jsonl', encoding='utf-8'):
    j = json.loads(norm(l)); w = j['word'].strip(); pos = j.get('pos')
    if pos not in POS_RU or w != w.lower(): continue          # capitalised headwords = proper names
    loan_ety = any(LOAN_ETY.search(e) for e in j.get('etymology_texts', []))
    senses = []
    for s in j.get('senses', []):
        gl = [x for x in s.get('glosses', []) if x]
        if not gl: continue
        raw = gl[0]
        lab, d = split_label(clean_gloss(raw))
        if not d: continue
        ex = []
        for e in s.get('examples', [])[:3]:
            t = (e.get('text') or '').strip(); tr = (e.get('translation') or '').strip()
            if t and tr and len(t) < 160: ex.append([t, tr, ''])
        senses.append(dict(lab=lab, d=d, ex=ex, calque='аналогично русскому слову' in raw))
    if not senses: continue
    extra = []
    for key, name in (('synonyms', 'Синонимы'), ('antonyms', 'Антонимы'), ('derived', 'Производные')):
        it = [x['word'] for x in j.get(key, []) if x.get('word') and not religious(x['word'])][:6]
        if it: extra.append(dict(kind=name, items=it))
    e = dict(pos=pos, senses=senses, extra=extra, f=freq.get(w, 0), loan=loan_ety, src='wkru')
    entries[w].append(e)
    for f in j.get('forms', []):
        fw = f['form'].lower()
        if 'romanization' in f.get('tags', []) or not LET.match(fw) or fw == w: continue
        form_of.setdefault(fw, w)

wk_en = {}; en_pos = {}
for l in open(f'{S}/en_cv.jsonl', encoding='utf-8'):
    j = json.loads(norm(l)); w = j['word']
    if j.get('pos') not in POS_RU or w != w.lower(): continue
    gl = [g for s in j.get('senses', []) for g in s.get('glosses', []) if 'letter of the' not in g and not s.get('form_of')]
    if not gl or any(s.get('form_of') or 'form-of' in s.get('tags', []) for s in j.get('senses', [])): continue
    wk_en.setdefault(w, []).extend(gl); en_pos.setdefault(w, j['pos'])
    for f in j.get('forms', []):
        fw = f['form'].lower()
        if 'romanization' in f.get('tags', []) or not LET.match(fw) or fw == w: continue
        form_of.setdefault(fw, w)

# ---------- cards ----------
def resolve_ref(d, depth=0):
    m = re.match(r'^см\.\s*([а-яёӑӗҫӳ]+)', d)
    if m and depth < 2 and m.group(1) in entries:
        return resolve_ref(entries[m.group(1)][0]['senses'][0]['d'], depth + 1)
    return d

UD = {}   # word -> {g: first gloss, loan, card, special, f}
BANNED = set(); NAMES = set()
for w, es in entries.items():
    if not LET.match(w): continue
    s0 = es[0]['senses'][0]; first_txt = s0['lab'] + ' ' + s0['d']
    if re.search(r'(?:мужское|женское) имя|^[А-ЯЁ]|сокращ|аббрев', s0['d']): NAMES.add(w); continue   # personal / place names, abbreviations
    if religious(w, first_txt) or offensive(w, first_txt, s0['lab']): BANNED.add(w); continue
    hom = []
    for e in es:
        ss = []
        for s in e['senses'][:6]:
            d = resolve_ref(s['d'])
            if religious('', s['lab'] + ' ' + d) or offensive('', d, s['lab']): continue      # drop the sense, keep the word
            ex = [x for x in s['ex'] if not (religious(x[0], x[1]) or offensive('', x[1]) or any(religious(t) or offensive(t) for t in re.findall(r'[а-яёӑӗҫӳ]+', x[0].lower())))]
            ss.append(dict(n=len(ss) + 1, lab=s['lab'], d=d[:200], ex=ex[:2]))
        if ss: hom.append(dict(pos=e['pos'], senses=ss))
    if not hom: BANNED.add(w); continue
    first = hom[0]['senses'][0]; g = first['d']
    ru_words = re.findall(r'[а-яё]+', ' '.join(s['d'].lower() for h in hom for s in h['senses'][:1]))
    loan = bool(LOAN_LET.search(w)) or any(e['loan'] for e in es) or any(s['calque'] for e in es for s in e['senses']) \
        or w in ru_words or (len(w) >= 4 and any(r.startswith(w[:-1]) and len(r) - len(w) <= 2 for r in ru_words if len(r) >= 4))
    special = all(any(x in s['lab'] for x in SPECIAL) for h in hom for s in h['senses'][:1])
    ref_only = all(REF_RE.match(s['d']) for h in hom for s in h['senses'])
    gram = ', '.join(sorted({POS_RU[e['pos']] for e in es} - {''}))
    ex_by = {}
    for e in es:
        for x in e['extra']:
            lst = ex_by.setdefault(x['kind'], [])
            lst += [i for i in x['items'] if i not in lst]
    extra = [dict(kind=k, items=v[:6]) for k, v in ex_by.items()][:3]
    UD[w] = dict(g=None if ref_only else g, loan=loan, special=special or ref_only, f=sum(e['f'] for e in es),
                 card=dict(stress='', gram=gram, hill='', hom=hom, extra=extra, src='wkru'))
# Homonyms whose main meaning is not the first ru.wiktionary entry: put main senses first (card order too) and join them in the short gloss
MAIN_FIRST = {'утӑ': ['сено', 'июль']}
for w, order in MAIN_FIRST.items():
    if w not in UD: continue
    hom = UD[w]['card']['hom']; key = lambda h: next((i for i, o in enumerate(order) if h['senses'][0]['d'].startswith(o)), len(order))
    hom.sort(key=key); have = [o for o in order if any(h['senses'][0]['d'].startswith(o) for h in hom)]
    if have: UD[w]['g'] = '; '.join(have)

# English-Wiktionary-only words: Russian translation of the English gloss (data_src/en_ru_glosses.tsv, '-' = exclude)
EN_RU = {}
for line in open(f'{ROOT}/data_src/en_ru_glosses.tsv', encoding='utf-8'):
    if line.startswith('#') or '\t' not in line: continue
    a, b = line.rstrip('\n').split('\t', 1); EN_RU[norm(a)] = b.strip()
for w, gl in wk_en.items():
    if EN_RU.get(w) == '-': BANNED.add(w); continue
    if w in UD or w in BANNED or w in NAMES or not LET.match(w): continue
    txt = ' '.join(gl)
    if religious(w, txt) or offensive(w, txt) or re.search(r'(?i)\b(?:god|church|christ|pray|sacrific|spirit|deit|pagan|priest|devil|demon|soul|holy|sin\b|sins\b|grave|corpse|death|dead|die\b|vodka|beer|alcohol|drunk|muezzin|mosque|islam|bibl|monk|angel|heaven|hell\b|witch|sorcer|magic|idol|shaman|curse|kill|murder|buddh|religio|worship|funeral|cemetery|ghost|abbreviation|initialism|surname|given name|vulgar|offensive)', txt):
        BANNED.add(w); continue
    loan = bool(LOAN_LET.search(w)) or bool(re.search(r'(?i)\bfrom russian\b', txt))
    ru = EN_RU.get(w)
    if ru and (religious(w, ru) or offensive(w, ru)): BANNED.add(w); continue
    UD[w] = dict(g=ru, en=None if ru else '; '.join(gl[:2])[:90], loan=loan, special=False, f=freq.get(w, 0),
                 card=dict(stress='', gram=POS_RU.get(en_pos.get(w), ''), hill='', hom=[dict(pos=en_pos.get(w), senses=[dict(n=1, lab='' if ru else 'англ.', d=(ru or '; '.join(gl[:3]))[:200], ex=[])])], extra=[], src='wken'))
UD_COMPLETE = True

def gloss(w):
    if w in UD and UD[w]['g']: return UD[w]['g'][:90], 'ud'
    if w in UD and UD[w].get('en'): return UD[w]['en'], 'en'
    if w in form_of and form_of[w] in UD and UD[form_of[w]]['g']:
        return ('форма слова ' + form_of[w] + ' — ' + UD[form_of[w]]['g'])[:90], 'ru'
    return None, None

# ---------- lexicon ----------
lex = {}
for w, v in UD.items():
    chuv_loan = v['loan'] and re.search('[ӑӗҫӳ]', w) and not LOAN_LET.search(w)   # Chuvash-adapted loans (страницӑ, ярмӑркка) may go to the grid
    lex[w] = dict(f=v['f'], b=(v['loan'] and not chuv_loan) or v['special'] or not gloss(w)[0])
for fw, lw in form_of.items():   # attested inflected forms (plurals etc.) of dictionary words: bonus only
    if fw in lex or lw not in UD or fw in BANNED: continue
    if religious(fw) or offensive(fw): continue
    lex[fw] = dict(f=freq.get(fw, 0), b=True)
HUN = set()
HUN_SKIP = {'тасс', 'кпсс', 'мин', 'лат', 'руна', 'бандит', 'кали', 'марса', 'катар', 'астул', 'евит'}   # abbreviations / names / unwanted
if os.environ.get('USE_HUNSPELL', '1') != '0' and os.path.exists(f'{S}/hunspell/cv_RU.dic'):
    for line in list(open(f'{S}/hunspell/cv_RU.dic', encoding='utf-8'))[1:]:
        w = norm(line.split('/')[0].strip())
        if w and w == w.lower() and LET.match(w): HUN.add(w)
    for w in HUN:   # extra bonus words: in the hunspell stem list AND seen >= 8 times in cv.wikipedia
        if w in lex or w in BANNED or w in NAMES or freq.get(w, 0) < (150 if len(w) == 3 else 30) or LOAN_LET.search(w) or mostly_capitalised(w): continue
        if religious(w) or offensive(w) or not re.search('[аеёиоуыэюяӑӗӳ]', w) or w in HUN_SKIP: continue
        lex[w] = dict(f=freq.get(w, 0), b=True, h=1)

def score(w):
    e = lex[w]; f = e['f']
    return (0 if f <= 0 else 4 * len(str(int(f)))) + min(f, 3000) / 30 + (6 if w in UD else 0) + (3 if w in UD and UD[w]['card']['hom'][0]['senses'][0]['ex'] else 0) + (4 if w in UD and UD[w]['g'] else 0)
GRID_MIN_F = int(os.environ.get('GRID_MIN_F', '0'))
grid_words = {w for w, e in lex.items() if not e['b'] and (e['f'] >= GRID_MIN_F or w in HUN)}
bonus_words = set(lex) | grid_words
print('lexicon', len(lex), 'cards', len(UD), 'grid', len(grid_words), 'bonus', len(bonus_words), 'banned', len(BANNED), 'names', len(NAMES),
      'hunspell-bonus', sum(1 for e in lex.values() if e.get('h')), file=sys.stderr)
_cc = {}
def can_make(word, pool):
    c = _cc.get(word)
    if c is None: c = _cc[word] = collections.Counter(word)
    return all(pool[k] >= v for k, v in c.items())
# --- crossword layout ---
def layout(words, tries=300):
    best = None
    for t in range(tries):
        ws = sorted(words, key=lambda w: -len(w)) if t == 0 else random.sample(words, len(words))
        if t and random.random() < .5: ws = sorted(ws, key=lambda w: -len(w) + random.random() * 2)
        grid = {}; placed = []
        def fits(w, r, c, d):
            dr, dc = (0, 1) if d == 'h' else (1, 0)
            if (r - dr, c - dc) in grid or (r + dr * len(w), c + dc * len(w)) in grid: return False
            cross = 0
            for i, ch in enumerate(w):
                p = (r + dr * i, c + dc * i)
                if p in grid:
                    if grid[p][0] != ch or grid[p][1] == d: return False
                    cross += 1
                else:
                    n1 = (p[0] + dc, p[1] + dr); n2 = (p[0] - dc, p[1] - dr)
                    if n1 in grid or n2 in grid: return False
            return cross
        def put(w, r, c, d):
            dr, dc = (0, 1) if d == 'h' else (1, 0)
            for i, ch in enumerate(w):
                p = (r + dr * i, c + dc * i)
                grid[p] = (ch, 'x' if p in grid else d)
            placed.append((w, r, c, d))
        put(ws[0], 0, 0, 'h')
        left = ws[1:]; progress = True
        while left and progress:
            progress = False
            for w in list(left):
                opts = []
                for (pr, pc), (ch, pd) in list(grid.items()):
                    if pd == 'x': continue
                    nd = 'v' if pd == 'h' else 'h'
                    for i, wc in enumerate(w):
                        if wc != ch: continue
                        r, c = (pr - i, pc) if nd == 'v' else (pr, pc - i)
                        x = fits(w, r, c, nd)
                        if x: opts.append((x, random.random(), r, c, nd))
                if opts:
                    opts.sort(reverse=True); _, _, r, c, d = opts[0]
                    put(w, r, c, d); left.remove(w); progress = True
        rs = [p[0] for p in grid]; cs = [p[1] for p in grid]
        h = max(rs) - min(rs) + 1; wd = max(cs) - min(cs) + 1
        sc = len(placed) * 100 - abs(h - wd) * 3 - h * wd * 0.5 - max(0, wd - 10) * 50 - max(0, h - 10) * 50
        if best is None or sc > best[0]:
            mr, mc = min(rs), min(cs)
            best = (sc, [(w, r - mr, c - mc, d) for w, r, c, d in placed], h, wd)
        if len(placed) == len(words) and t > 60: break
    return best

