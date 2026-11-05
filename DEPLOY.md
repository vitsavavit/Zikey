# Deploy ZIKEY

This is a Python Streamlit application. GitHub Pages cannot execute it.
Use Streamlit Community Cloud with the GitHub source repository:

- Repository: `vitsavavit/Zikey`
- Branch: `main`
- Main file: `app.py`
- Python: `3.13`
- No secrets or API keys required for the template-fallback demo.

Open https://share.streamlit.io/ and choose Create app → deploy from GitHub.
The platform installs requirements.txt; static serving is enabled in .streamlit/config.toml.
Do not upload .venv, .runtime, .build, raw snapshots or secrets.

The hosted server cannot reach Ollama on your Mac. Without a co-located Ollama service,
Explain uses the explicitly labelled template fallback; ranking and all linked views still work.
The deployment does not claim hosted LLM inference is enabled.

Verify after deployment: search qing → select 請 → change goal → mark/unmark known;
coverage should change4.9%↔5.6%. Check Expand/Restore and repeated title clicks.

Source terms and attribution remain in data/processed/sources.json. Raw TOCFL snapshots are
excluded from Git. The library image is user-supplied prototype imagery, not an owned stock asset.
