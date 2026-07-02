from pathlib import Path
import re

home_path = Path('resources/js/Pages/Home.jsx')
trans_path = Path('resources/js/i18n/translations.js')

home = home_path.read_text(encoding='utf-8')
trans = trans_path.read_text(encoding='utf-8')

home_key_pattern = re.compile(r"(?<![\w$\.])t\(\s*(['\"])(.*?)\1\s*\)")
trans_key_pattern = re.compile(r"^\s*([A-Za-z0-9_]+):\s*(['\"]).*?\2", re.MULTILINE)

home_keys = sorted({m.group(2) for m in home_key_pattern.finditer(home)})
trans_keys = sorted({m.group(1) for m in trans_key_pattern.finditer(trans)})

missing = [k for k in home_keys if k not in trans_keys]
print('home keys count', len(home_keys))
print('trans keys count', len(trans_keys))
print('home keys:')
for key in home_keys:
    print(key)
print('missing keys:')
for key in missing:
    print(key)
