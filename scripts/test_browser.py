import asyncio
import os
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def main():
    print("Testing browser automation...")
    # Set HOME for playwright if it's missing on Windows
    if 'HOME' not in os.environ:
        os.environ['HOME'] = os.environ.get('USERPROFILE', '')
        
    browser_config = BrowserConfig(headless=True)
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url="https://example.com")
        if result.success:
            print(f"✅ Success! Page title: {result.markdown[:50]}...")
        else:
            print(f"❌ Failed: {result.error_message}")

if __name__ == "__main__":
    asyncio.run(main())
