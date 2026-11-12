"""Bundle trusted local component assets without cloud static-route dependencies."""
import base64
from pathlib import Path


def workspace_assets(directory):
    directory = Path(directory)
    css = (directory / 'workspace.css').read_text()
    for name in ('paper-texture.png', 'library-shelves.png', 'walnut-library.jpg',
                 'rag-paper.jpg', 'leather-books.webp', 'rotunda-library.jpg'):
        encoded = base64.b64encode((directory / name).read_bytes()).decode('ascii')
        mime = {'.jpg': 'image/jpeg', '.webp': 'image/webp'}.get(Path(name).suffix, 'image/png')
        css = css.replace('/app/static/' + name, 'data:' + mime + ';base64,' + encoded)
    font = base64.b64encode((directory / 'PatrickHand-Regular.ttf').read_bytes()).decode('ascii')
    css = css.replace('/app/static/PatrickHand-Regular.ttf', 'data:font/ttf;base64,' + font)
    js = '\n'.join((directory / name).read_text() for name in
                   ('d3.min.js', 'plotly.min.js', 'book_shelf.js', 'library_overview.js', 'workspace.js'))
    # Font-face rules inside a shadow root are not consistently registered by browsers.
    setup = ("if(![...document.fonts].some(f=>f.family==='Patrick Hand')){"
             "const face=new FontFace('Patrick Hand','url(data:font/ttf;base64," + font + ")');"
             "await face.load();document.fonts.add(face);}")
    js = js.replace('export default async function(component) {',
                    'export default async function(component) {' + setup)
    return (directory / 'workspace.html').read_text(), css, js
