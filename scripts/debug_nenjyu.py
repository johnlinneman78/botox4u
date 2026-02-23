import requests, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ja,en;q=0.9',
    'Referer': 'https://nenjyu.com/',
}

r = requests.get('https://nenjyu.com/?mode=cate&cbid=121270&csid=0&sort=p', headers=HEADERS, timeout=15)
raw = r.content
html_eucjp = raw.decode('euc-jp', errors='replace')
print(f'Page size: {len(raw)} bytes')

# 1. Look for JS variable with count
js_counts = re.findall(r'(?:totalCount|item_count|total_count|product_count|count)\s*[=:]\s*(\d+)', html_eucjp, re.IGNORECASE)
print(f'JS count vars: {js_counts}')

# 2. Look for 全XX件 in raw bytes (EUC-JP: 全=0xC1B4, 件=0xB7EF)
# In EUC-JP: 全 is \xc1\xb4, 件 is \xb7\xef
ALL_BYTES = b'\xc1\xb4'   # 全 in EUC-JP
KEN_BYTES = b'\xb7\xef'   # 件 in EUC-JP
idx = raw.find(ALL_BYTES)
while idx != -1:
    chunk = raw[idx:idx+20]
    print(f'Found 全 at byte {idx}: {chunk.hex()} -> decoded: {chunk.decode("euc-jp", errors="replace")}')
    idx = raw.find(ALL_BYTES, idx+1)
    if idx > 200000:
        break

# 3. Search for 件 (ken) alone in raw bytes
ken_positions = []
idx = raw.find(KEN_BYTES)
while idx != -1:
    ken_positions.append(idx)
    idx = raw.find(KEN_BYTES, idx+1)
print(f'\n件 found at {len(ken_positions)} positions')
for pos in ken_positions[:5]:
    chunk = raw[max(0,pos-10):pos+10]
    print(f'  pos {pos}: {repr(chunk.decode("euc-jp", errors="replace"))}')

# 4. Check if decoded text has 全 at all
zen_count = html_eucjp.count('\u5168')  # 全
print(f'\n全 char occurrences in decoded HTML: {zen_count}')

# 5. Find all digit sequences near any CJK character
cjk_near_digits = re.findall(r'[\u4e00-\u9fff]{0,3}(\d{2,4})[\u4e00-\u9fff]{0,3}', html_eucjp)
print(f'Digits near CJK chars: {cjk_near_digits[:20]}')
