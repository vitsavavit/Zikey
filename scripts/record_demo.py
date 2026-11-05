"""Record a 150-second captioned walkthrough of the actual localhost application."""

import time
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

OUT = Path(__file__).resolve().parents[1] / "deliverables"


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1600, "height": 1000},
                                      record_video_dir=str(OUT.parent / ".build/recording"),
                                      record_video_size={"width": 1600, "height": 1000})
        page = context.new_page()
        page.goto("http://127.0.0.1:8501")
        page.locator('.character-node[data-character="青"]').wait_for(timeout=60000)
        start = time.monotonic()

        def caption(text):
            page.evaluate("""text => {
              let el=document.getElementById('demo-caption');
              if(!el){el=document.createElement('div');el.id='demo-caption';document.body.append(el);}
              Object.assign(el.style,{position:'fixed',bottom:'12px',left:'20%',right:'2%',padding:'16px 24px',
                background:'#192f40',color:'white',fontSize:'22px',lineHeight:'1.45',borderRadius:'6px',zIndex:'999999',
                boxShadow:'0 2px 12px #0003',fontFamily:'Arial,sans-serif',pointerEvents:'none'});
              el.textContent=text;
            }""", text)

        def hold_until(seconds):
            remaining = start + seconds - time.monotonic()
            if remaining > 0:
                page.wait_for_timeout(remaining * 1000)

        caption("ZIKEY: a working local prototype with 290 characters and 450 real TOCFL vocabulary entries.")
        hold_until(18)
        caption("Search qing to find related pronunciations. The network also shows shared components. 睛 is jīng, not qing.")
        page.get_by_role("textbox", name="Search a character or pinyin").fill("qing3")
        page.get_by_role("textbox", name="Search a character or pinyin").press("Enter")
        hold_until(40)
        page.locator('.character-node[data-character="請"]').click()
        expect(page.get_by_text("Selected: 請", exact=True)).to_be_visible()
        caption("Selecting 請 updates the linked views. 青 supplies the sound component; 言 supplies the meaning component.")
        page.locator('[data-testid="stMain"]').evaluate("el => el.scrollTop = 400")
        hold_until(62)
        page.get_by_role("button", name="Explain with local AI", exact=True).click()
        expect(page.get_by_text("Local LLM · supported evidence selection", exact=False)).to_be_visible(timeout=90000)
        caption("Ollama runs on this Mac. The LLM selects supported evidence sentences and cannot change the numeric ranking.")
        hold_until(87)
        page.get_by_role("combobox", name="Learning goal").click()
        page.get_by_role("option", name="See structure", exact=True).click()
        page.get_by_role("heading", name="C · Coverage compare", exact=True).scroll_into_view_if_needed()
        caption("Changing the goal changes the score weights. The coverage chart recomputes the next 100 learning steps for each order.")
        hold_until(110)
        page.get_by_role("button", name="Mark as known", exact=True).click()
        expect(page.get_by_role("button", name="Unmark as known", exact=True)).to_be_visible()
        page.get_by_role("heading", name="C · Coverage compare", exact=True).scroll_into_view_if_needed()
        caption("Marking 請 as known unlocks complete words only when all their other characters are already known, such as 問 in 請問.")
        hold_until(132)
        page.get_by_role("button", name="Unmark as known", exact=True).click()
        page.get_by_role("button", name="Reset demo", exact=True).click()
        page.locator('[data-testid="stMain"]').evaluate("el => el.scrollTop = 0")
        caption("Pilot vocabulary coverage is not real-text comprehension. Next: richer frequency data and learner testing.")
        hold_until(150)
        video = page.video
        context.close()
        video.save_as(str(OUT / "ZIKEY-demo.webm"))
        browser.close()
        print(f"Recorded {round(time.monotonic()-start, 1)} seconds: {OUT / 'ZIKEY-demo.webm'}")


if __name__ == "__main__":
    run()
