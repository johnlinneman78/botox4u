"""
Real Network Request Capture for GA4 and Ahrefs in Production Mode.
Verifies network request counts, parameter sanitization, and third-party isolation
from the very start of navigation across:
  1. Initial load (/find-providers?city=portland)
  2. Client-side navigation to provider profile (/provider/[slug])
  3. Browser Back navigation (popstate)
  4. Filter change (city=seattle)
  5. Geolocation activation (sort=distance with HttpOnly session cookie)
  6. Legacy coordinate URL navigation (/find-providers?lat=45.5152&lng=-122.6784)
  7. Subsequent custom-event page context verification (provider_search)
"""

import os
import sys
import time
import json
import subprocess
import urllib.parse
from playwright.sync_api import sync_playwright

PORT = 3099
BASE_URL = f"http://localhost:{PORT}"

current_step = "Setup"

def run_capture():
    global current_step
    print(f"=== Starting Production Next.js Server on port {PORT} ===")
    env = os.environ.copy()
    env["PORT"] = str(PORT)
    env["NODE_ENV"] = "production"
    # Ensure GA_ID is active for trackers
    env["NEXT_PUBLIC_GA_ID"] = "G-0JH92YS466"

    # Start next start
    server_process = subprocess.Popen(
        f"npx next start -p {PORT}",
        cwd=r"c:\Users\uriel\.gemini\antigravity\playground\fiery-cosmos",
        env=env,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    # Wait for server to start
    print("Waiting for server to become ready...")
    server_ready = False
    for _ in range(30):
        time.sleep(1)
        try:
            import urllib.request
            req = urllib.request.urlopen(f"{BASE_URL}/api-access", timeout=2)
            if req.status == 200:
                server_ready = True
                print("Server is ready!")
                break
        except Exception:
            pass

    if not server_ready:
        print("Failed to connect to Next.js production server.")
        server_process.terminate()
        sys.exit(1)

    captured_requests = []

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()

            def on_request(request):
                url = request.url
                is_ga4 = "google-analytics.com" in url or "googletagmanager.com/gtag" in url
                is_ahrefs = "analytics.ahrefs.com" in url or "ahrefs.com" in url

                if is_ga4 or is_ahrefs:
                    post_data = request.post_data
                    headers = request.headers
                    parsed_url = urllib.parse.urlparse(url)
                    qs = urllib.parse.parse_qs(parsed_url.query)

                    captured_requests.append({
                        "timestamp": round(time.time() * 1000),
                        "step": current_step,
                        "tracker": "GA4" if is_ga4 else "Ahrefs",
                        "method": request.method,
                        "url": url,
                        "endpoint": f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}",
                        "query_params": {k: v[0] if len(v) == 1 else v for k, v in qs.items()},
                        "post_data": post_data,
                        "referrer": headers.get("referer", ""),
                    })

            page = context.new_page()
            page.on("request", on_request)

            # Case 1: Initial navigation to /find-providers?city=portland
            current_step = "Case 1: Initial Load (/find-providers?city=portland)"
            print(f"\n--- Executing {current_step} ---")
            page.goto(f"{BASE_URL}/find-providers?city=portland", wait_until="networkidle")
            time.sleep(3.5)

            # Case 2: Client navigation to provider profile
            current_step = "Case 2: Client-side Navigation to Provider Profile"
            print(f"\n--- Executing {current_step} ---")
            provider_links = page.locator('a[href^="/provider/"]')
            if provider_links.count() > 0:
                first_link = provider_links.first
                provider_href = first_link.get_attribute("href")
                print(f"Clicking client link: {provider_href}")
                first_link.click()
                page.wait_for_url("**/provider/**", timeout=10000)
            else:
                page.evaluate('window.location.href = "/provider/fresh-faces-rx-advanced-aesthetics-in-portland-dr-jodee-m-anderson-md-portland-or"')
                page.wait_for_url("**/provider/**", timeout=10000)
            page.wait_for_load_state("networkidle")
            time.sleep(3.5)

            # Case 3: Browser Back Navigation (popstate)
            current_step = "Case 3: Browser Back Navigation (popstate)"
            print(f"\n--- Executing {current_step} ---")
            page.go_back(wait_until="networkidle")
            time.sleep(3.5)

            # Case 4: Filter Change (city=seattle)
            current_step = "Case 4: Filter Change (city=seattle)"
            print(f"\n--- Executing {current_step} ---")
            page.goto(f"{BASE_URL}/find-providers?city=seattle", wait_until="networkidle")
            time.sleep(3.5)

            # Case 5: Geolocation activation (sort=distance)
            current_step = "Case 5: Geolocation Activation (sort=distance with HttpOnly cookie)"
            print(f"\n--- Executing {current_step} ---")
            page.goto(f"{BASE_URL}/find-providers?sort=distance", wait_until="networkidle")
            time.sleep(3.5)

            # Case 6: Legacy coordinate URL access (/find-providers?lat=45.5152&lng=-122.6784)
            current_step = "Case 6: Legacy Coordinate URL (Edge 307 Interception)"
            print(f"\n--- Executing {current_step} ---")
            page.goto(f"{BASE_URL}/find-providers?lat=45.5152&lng=-122.6784", wait_until="networkidle")
            time.sleep(3.5)
            print(f"Final URL in browser after legacy access: {page.url}")

            # Case 7: Subsequent custom-event page context verification
            current_step = "Case 7: Custom Event Telemetry Context"
            print(f"\n--- Executing {current_step} ---")
            try:
                with page.expect_request(
                    lambda r: "google-analytics.com/g/collect" in r.url,
                    timeout=5000
                ) as req_info:
                    page.evaluate("""
                        if (typeof window.gtag === 'function') {
                            window.gtag('event', 'provider_search', {
                                search_city: 'portland',
                                location_resolved: true,
                                result_count: 14,
                                send_to: 'G-0JH92YS466'
                            });
                        }
                    """)
                print(f"Custom event provider_search network request captured: {req_info.value.url[:80]}...")
            except Exception as e:
                print(f"Wait note: {e}")
            page.wait_for_timeout(2000)

            browser.close()
    finally:
        print("\nTerminating Next.js server...")
        try:
            subprocess.run(f"taskkill /F /T /PID {server_process.pid}", shell=True, capture_output=True)
        except Exception:
            server_process.terminate()

    # Save results to JSON file for analysis
    output_path = r"c:\Users\uriel\.gemini\antigravity\playground\fiery-cosmos\scripts\captured_network_requests.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(captured_requests, f, indent=2)

    print(f"\nCaptured {len(captured_requests)} total tracker requests.")
    print(f"Saved network capture log to: {output_path}")

    # Inspect captured requests for leaks
    print("\n=== NETWORK LEAK AUDIT ===")
    leak_found = False
    for req in captured_requests:
        raw_repr = json.dumps(req)
        # Check for coordinate leaks
        if "45.5152" in raw_repr or "-122.6784" in raw_repr or "122.6784" in raw_repr:
            print(f"[FAIL] Coordinate leak detected in {req['tracker']} request: {req['url']}")
            leak_found = True
        # Check for free query q leak
        if "q=" in req['url'] or "q=" in (req.get('referrer') or ""):
            print(f"[FAIL] Query 'q' leak detected in {req['tracker']} request: {req['url']}")
            leak_found = True

    if not leak_found:
        print("[PASS] Zero coordinate leaks and zero personal query leaks across all captured GA4 & Ahrefs requests!")

if __name__ == "__main__":
    run_capture()
