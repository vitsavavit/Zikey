#!/bin/zsh
set -e
cd "$(dirname "$0")"
if [[ ! -x .venv/bin/python ]]; then
  python3 -m venv .venv
  .venv/bin/python -m pip install -r requirements.txt
fi
if curl -fs --max-time 1 http://127.0.0.1:8501/_stcore/health >/dev/null; then
  open http://127.0.0.1:8501
  exit 0
fi
exec .venv/bin/python -m streamlit run app.py --server.headless false
