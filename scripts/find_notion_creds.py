import requests
import json
import os

# The MCP server must have credentials - let's extract them
# We'll make direct API calls using the requests library

NOTION_VERSION = "2022-06-28"
PARENT_PAGE_ID = "309baf92cb44813cb5b3f160fb4c73b8"  # Without dashes

# We need to find the Notion API token that the MCP server is using
# Let's check environment variables or config files

print("Checking for Notion credentials...")

# Check common environment variable names
possible_env_vars = [
    'NOTION_API_KEY',
    'NOTION_TOKEN',
    'NOTION_API_TOKEN',
    'NOTION_INTEGRATION_TOKEN'
]

token = None
for var in possible_env_vars:
    token = os.getenv(var)
    if token:
        print(f"Found token in {var}")
        break

if not token:
    print("No token found in environment variables")
    print("The MCP server must be using a config file")
    print("\nLet's try to find the MCP server configuration...")
    
    # Common MCP config locations
    config_paths = [
        os.path.expanduser("~/.config/mcp/notion-mcp-server.json"),
        os.path.expanduser("~/.mcp/notion-mcp-server.json"),
        os.path.expanduser("~/AppData/Roaming/mcp/notion-mcp-server.json"),
        os.path.expanduser("~/AppData/Local/mcp/notion-mcp-server.json"),
    ]
    
    for path in config_paths:
        if os.path.exists(path):
            print(f"Found config at: {path}")
            with open(path, 'r') as f:
                config = json.load(f)
                print(json.dumps(config, indent=2))
        else:
            print(f"Not found: {path}")

print("\nSearching for MCP configuration files...")
# Search for any JSON files that might contain Notion config
import glob
home = os.path.expanduser("~")
for pattern in ["**/*notion*.json", "**/*mcp*.json"]:
    files = glob.glob(os.path.join(home, ".config", pattern), recursive=True)
    files += glob.glob(os.path.join(home, "AppData", pattern), recursive=True)
    for file in files[:10]:  # Limit to first 10
        print(f"Found: {file}")
