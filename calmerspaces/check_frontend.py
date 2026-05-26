import urllib.request
import re

url = "https://calmerplaces.com/"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        
    print(f"Fetched successfully! Length of HTML: {len(html)}")
    
    # Search for keywords
    dental_matches = re.findall(r'(?i)dental', html)
    hello_matches = re.findall(r'(?i)hello world', html)
    calmer_matches = re.findall(r'(?i)calmerplaces', html)
    
    print(f"Dental mentions: {len(dental_matches)}")
    print(f"Hello World mentions: {len(hello_matches)}")
    print(f"CalmerPlaces mentions: {len(calmer_matches)}")
    
    # Print some snippets containing "dental" or "hello world" if any
    for m in re.finditer(r'(?i)dental', html):
        start = max(0, m.start() - 50)
        end = min(len(html), m.end() + 50)
        print(f"DENTAL SNIPPET: ...{html[start:end]}...")
        break # just show first one
        
    for m in re.finditer(r'(?i)hello world', html):
        start = max(0, m.start() - 50)
        end = min(len(html), m.end() + 50)
        print(f"HELLO WORLD SNIPPET: ...{html[start:end]}...")
        break # just show first one

except Exception as e:
    print(f"Error fetching: {e}")
