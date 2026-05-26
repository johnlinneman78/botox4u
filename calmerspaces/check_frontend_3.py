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
        
    print(f"Hello World count: {len(re.findall(r'(?i)hello world', html))}")
    print(f"Dental Clinic count: {len(re.findall(r'(?i)dental clinic', html))}")
    print(f"Phone number (888) count: {len(re.findall(r'888', html))}")
    print(f"Powered by Dental count: {len(re.findall(r'(?i)powered by dental', html))}")
except Exception as e:
    print(f"Error: {e}")
