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
        
    print(f"actually get it: {len(re.findall(r'(?i)actually get it', html))}")
    print(f"sensory-friendly: {len(re.findall(r'(?i)sensory-friendly', html))}")
    print(f"Verified places: {len(re.findall(r'(?i)Verified places', html))}")
except Exception as e:
    print(f"Error: {e}")
