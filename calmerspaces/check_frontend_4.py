import urllib.request
import re

url = "https://calmerplaces.com/?rand=1234"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        
    print(f"Hello World count: {len(re.findall(r'(?i)hello world', html))}")
    print(f"Dental Clinic count: {len(re.findall(r'(?i)dental clinic', html))}")
    print(f"Phone number (888) count: {len(re.findall(r'888', html))}")
    print(f"Powered by Dental count: {len(re.findall(r'(?i)powered by dental', html))}")
    
    # Let's inspect where "888" is in the HTML
    for m in re.finditer(r'888', html):
        start = max(0, m.start() - 60)
        end = min(len(html), m.end() + 60)
        print(f"888 SNIPPET: ...{html[start:end]}...")

except Exception as e:
    print(f"Error: {e}")
