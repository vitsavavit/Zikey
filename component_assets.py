"""Bundle trusted local component assets without cloud static-route dependencies."""
import base64
from pathlib import Path


def workspace_assets(directory):
    directory = Path(directory)
    css = (directory / 'workspace.css').read_text()
    for name in ('paper-texture.png', 'library-shelves.png'):
        encoded = base64.b64encode((directory / name).read_bytes()).decode('ascii')
        css = css.replace('/app/static/' + name, 'data:image/png;base64,' + encoded)
    js = '\n'.join((directory / name).read_text() for name in
                   ('d3.min.js', 'plotly.min.js', 'workspace.js'))
    return (directory / 'workspace.html').read_text(), css, js
