"""Exercise real D3 callbacks and capture desktop / narrow-screen evidence."""

import json
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

OUT = Path(__file__).resolve().parents[1] / "deliverables"


def run():
    errors, failures = [], []
    checks = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 1800}, device_scale_factor=1)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("requestfailed", lambda request: failures.append({"url": request.url, "failure": request.failure}))
        page.goto("http://127.0.0.1:8501")
        node = page.locator('.character-node[data-character="請"]')
        node.wait_for(timeout=60000)
        node.focus()
        node.press("Enter")
        expect(page.get_by_text("Selected: 請", exact=True)).to_be_visible()
        expect(page.get_by_text("Sound component: 青 · Meaning component: 言", exact=True)).to_be_visible()
        checks.append("Keyboard D3 selection updates linked details, score context and coverage context")
        page.get_by_role("button", name="Explain with local AI", exact=True).click()
        expect(page.get_by_text("Local LLM · supported evidence selection", exact=False)).to_be_visible(timeout=90000)
        checks.append("Local LLM explanation shown in the real browser")
        page.screenshot(path=str(OUT / "app-selected.png"), full_page=True)
        metric = page.locator('[data-testid="stMetric"]').filter(has_text="Vocabulary readable now")
        before = float(metric.locator('[data-testid="stMetricValue"]').inner_text().rstrip("%"))
        page.get_by_role("button", name="Mark as known", exact=True).click()
        expect(page.get_by_role("button", name="Unmark as known", exact=True)).to_be_visible()
        expect(page.get_by_text("Already known; excluded from recommendations.", exact=True)).to_be_visible()
        after = float(metric.locator('[data-testid="stMetricValue"]').inner_text().rstrip("%"))
        assert after > before
        page.get_by_role("button", name="Unmark as known", exact=True).click()
        expect(page.get_by_role("button", name="Mark as known", exact=True)).to_be_visible()
        assert float(metric.locator('[data-testid="stMetricValue"]').inner_text().rstrip("%")) == before
        checks.append("Mark/unmark updates vocabulary coverage and recommendation exclusion")
        page.get_by_role("combobox", name="Learning goal").click()
        page.get_by_role("option", name="See structure", exact=True).click()
        expect(page.get_by_text("Goal: See structure · ranking is computed, the LLM only explains it.", exact=True)).to_be_visible()
        checks.append("Goal preset updates ranking and coverage without losing selected character")
        page.get_by_text("Use simulated heat", exact=True).click()
        expect(page.get_by_text("Simulated lookup counts for testing. No community data.", exact=True)).to_be_visible()
        checks.append("Simulated heat is visibly labelled")
        page.get_by_role("button", name="Reset demo", exact=True).click()
        expect(page.get_by_text("Selected: 青", exact=True)).to_be_visible()
        page.screenshot(path=str(OUT / "app-overview.png"), full_page=True)
        for width in [320, 768, 1024, 1440]:
            page.set_viewport_size({"width": width, "height": 1100})
            page.wait_for_timeout(700)
            overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
            assert not overflow, f"Horizontal document overflow at {width}px"
            assert not page.locator('[data-testid="stException"]').count()
            checks.append(f"No document overflow or app exception at {width}px")
            if width == 320:
                page.screenshot(path=str(OUT / "app-mobile.png"), full_page=True)
        assert not errors, errors
        assert not failures, failures
        browser.close()
    result = {"checks": checks, "page_errors": errors, "failed_requests": failures}
    (OUT / "browser-checks.json").write_text(json.dumps(result, indent=2))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    run()
