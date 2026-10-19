"""Chuvash orthography normalisation: look-alike Latin letters (ă ĕ ç ÿ, also Latin a e o p c x y k ...) inside
Cyrillic words -> proper Cyrillic code points ӑ U+04D1, ӗ U+04D7, ҫ U+04AB, ӳ U+04F3 (and plain Cyrillic)."""
import re, unicodedata
_MAP = {'ă': 'ӑ', 'Ă': 'Ӑ', 'ĕ': 'ӗ', 'Ĕ': 'Ӗ', 'ç': 'ҫ', 'Ç': 'Ҫ', 'ÿ': 'ӳ', 'Ÿ': 'Ӳ', 'ӱ': 'ӳ', 'Ӱ': 'Ӳ', 'ü': 'ӳ', 'Ü': 'Ӳ',
        'ә': 'ӗ', 'Ә': 'Ӗ',  # schwa ә sometimes typed for ӗ
        'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с', 'x': 'х', 'y': 'у', 'k': 'к', 'm': 'м', 't': 'т', 'h': 'н', 'b': 'в',
        'A': 'А', 'E': 'Е', 'O': 'О', 'P': 'Р', 'C': 'С', 'X': 'Х', 'K': 'К', 'M': 'М', 'T': 'Т', 'H': 'Н', 'B': 'В', 'ё': 'ё'}
_TR = str.maketrans(_MAP)
LETTERS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяӑӗҫӳ'
TOK = re.compile(r'[а-яёӑӗҫӳ]+')
def norm(s):
    s = unicodedata.normalize('NFC', s)
    s = s.replace('с\u0327', 'ҫ').replace('С\u0327', 'Ҫ')
    out = []
    for w in re.split(r'(\s+)', s):          # map Latin look-alikes only inside words that contain Cyrillic
        out.append(w.translate(_TR) if re.search('[а-яёА-ЯЁӑӗҫӳӐӖҪӲ]', w) else w)
    return ''.join(out)
