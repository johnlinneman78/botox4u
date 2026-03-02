from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Error: {err}"))
        
        print("Navigating to api-access...")
        try:
            page.goto("http://localhost:3000/api-access", wait_until="networkidle")
            page.wait_for_timeout(2000)
            
            print("Clicking buttons...")
            for btn in page.locator('button, a').all():
                try:
                    btn.click(timeout=1000)
                    page.wait_for_timeout(500)
                except:
                    pass
        except Exception as e:
            print(f"Exception: {e}")
            
        print("Done")
        browser.close()

if __name__ == "__main__":
    run()
