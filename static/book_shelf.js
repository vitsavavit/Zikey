async function createBookShelf(stage) {
  const T = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera();
  camera.position.set(0, 2.2, 12);
  camera.lookAt(0, 1.37, 0);
  const loader = new T.TextureLoader();
  const styles = getComputedStyle(stage);
  const asset = name => styles.getPropertyValue(name).trim().slice(5, -2);
  const [atlas, paper] = await Promise.all([
    loader.loadAsync(asset('--shelf-leather')),
    loader.loadAsync(asset('--shelf-paper'))
  ]);
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  const ink = document.createElement('div');
  ink.className = 'zk-shelf-ink';
  ink.setAttribute('aria-hidden', 'true');
  atlas.colorSpace = paper.colorSpace = T.SRGBColorSpace;
  const material = (color, map) => new T.MeshBasicMaterial({color, map: map || null});
  const edges = material('#c4aa80');
  const page = material('#fff1d4', paper);
  const shelf = material('#755234');
  const W = 1.10, H = 2.06, depth = .54, binding = .11;
  const spineWidth = depth + 2 * binding + .02;
  function leatherSpine(index) {
    const texture = atlas.clone();
    const tile = 1 / 5;
    // Crop the leather and gilt tooling inside the illustrated book edges.
    texture.repeat.set(.68 * tile, .78);
    texture.offset.set((index + .18) * tile, .11);
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return material('#ffffff', texture);
  }
  function stampedCover(index, glyph) {
    const image = atlas.image;
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const tile = image.width / 5;
    ctx.drawImage(image, index * tile, 0, tile, image.height, 0, 0, canvas.width, canvas.height);
    ctx.font = '600 144px "Songti TC", "Noto Serif CJK TC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#39210f';
    ctx.strokeText(glyph, 192, 363);
    ctx.fillStyle = '#e7c582';
    ctx.fillText(glyph, 192, 360);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    return material('#ffffff', texture);
  }
  function box(parent, size, position, surfaces) {
    const mesh = new T.Mesh(new T.BoxGeometry(...size), surfaces);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  box(scene, [12, .16, 2.55], [0, .20, -.3], [shelf,shelf,material('#8b613b'),shelf,shelf,shelf]);
  function label(text, css, lang) {
    const element = document.createElement('span');
    element.textContent = text;
    element.className = css;
    if (lang) element.lang = lang;
    ink.append(element);
    return element;
  }
  function makeBook(button, index) {
    const group = new T.Group();
    scene.add(group);
    const cover = new T.Group();
    cover.position.z = depth / 2;
    group.add(cover);
    const color = ['#344b34', '#293e53', '#683836', '#805726', '#283e32'][index];
    const leather = material(color);
    box(group, [W, H, binding], [W/2, 0, -(depth+binding)/2], leather);
    box(group, [W-.06, H-.10, depth-.035], [W/2, 0, 0], [edges,edges,edges,edges,page,edges]);
    box(group, [.09, H, spineWidth], [0, 0, 0], [leather,leatherSpine(index),leather,leather,leather,leather]);
    box(cover, [W, H, binding], [W/2, 0, binding/2],
      [leather,leather,leather,leather,stampedCover(index, button.dataset.character),page]);
    const glyph = button.dataset.character;
    return {button, group, cover, progress: 0, spine: label(glyph, 'spine', 'zh-Hant'),
      left: label(glyph, 'page', 'zh-Hant'), right: label(button.dataset.reading, 'page')};
  }
  let books = [], selected = null;
  function clearBooks() {
    for (const {group, spine, left, right} of books) {
      group.removeFromParent();
      const surfaces = new Set();
      group.traverse(mesh => {
        mesh.geometry?.dispose();
        for (const surface of [mesh.material].flat()) surfaces.add(surface);
      });
      surfaces.delete(edges);surfaces.delete(page);surfaces.delete(undefined);
      for (const surface of surfaces) {
        surface.map?.dispose();
        surface.dispose();
      }
      spine.remove();left.remove();right.remove();
    }
  }
  const vector = new T.Vector3();
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => { const x = clamp(value); return x*x*(3-2*x); };
  let frame = 0, previous = 0, width = 0, height = 0;
  function position(element, owner, x, y, z, size, visible) {
    element.hidden = !visible;
    if (!visible) return;
    vector.set(x,y,z).applyMatrix4(owner.matrixWorld).project(camera);
    element.style.left = `${(vector.x+1)*50}%`;
    element.style.top = `${(1-vector.y)*50}%`;
    element.style.fontSize = `${size*height/(camera.top-camera.bottom)}px`;
  }
  function draw(time) {
    frame = 0;
    const dt = previous ? Math.min(time-previous, 40) : 16;
    previous = time;
    if (!stage.isConnected || !width || !height) { previous = 0; return; }
    const activeIndex = books.findIndex(book => book.button.dataset.character === selected);
    const middle = (books.length-1)/2;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let moving = false;
    for (const [index, book] of books.entries()) {
      const active = index === activeIndex;
      const target = Number(active);
      book.progress = reduced ? target : active ? Math.min(1, book.progress+dt/790) : Math.max(0, book.progress-dt/360);
      moving ||= book.progress !== target;
      const p = book.progress;
      const pull = ease(p/.31), turn = ease((p-.20)/.32), open = ease((p-.64)/.36);
      const restX = (index-middle)*.92;
      const targetX = activeIndex < 0 || active ? restX : restX + (index < activeIndex ? -.67 : .67);
      book.slot ??= restX;
      book.slot = reduced || Math.abs(book.slot-targetX)<.01 ? targetX : T.MathUtils.lerp(book.slot,targetX,1-Math.exp(-dt/75));
      moving ||= book.slot !== targetX;
      book.group.position.set(T.MathUtils.lerp(book.slot, restX, turn), 1.31+.17*pull, -.28+1.30*pull);
      book.group.rotation.y = (1-turn)*Math.PI/2;
      book.cover.rotation.y = -open*Math.PI;
    }
    renderer.render(scene, camera);
    for (const book of books) {
      const {progress, group, cover, button} = book;
      const scale = height/(camera.top-camera.bottom);
      const open = ease((progress-.64)/.36);
      vector.set(group.position.x + .5*W*(1-open)*ease((progress-.20)/.32),
        group.position.y, group.position.z).project(camera);
      button.style.setProperty('--hit-left', `${(vector.x+1)*50}%`);
      button.style.setProperty('--hit-top', `${(1-vector.y)*50}%`);
      button.style.setProperty('--hit-width', `${Math.max(24, (spineWidth+(2*W-spineWidth)*open)*scale)}px`);
      button.style.setProperty('--hit-height', `${H*scale}px`);
      position(book.spine, group, -.048, .02, 0, .43, progress<.22);
      position(book.left, cover, W/2, 0, -.012, .60, progress>.93);
      position(book.right, group, W/2, 0, depth/2, .29, progress>.93);
    }
    if (moving) animate();
    else previous = 0;
  }
  const animate = () => { if (!frame) frame = requestAnimationFrame(draw); };
  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    if (!width || !height) return;
    const span = Math.max(2.6+.92*(books.length-1), 2.7 * width/height);
    camera.left = -span/2;
    camera.right = span/2;
    camera.top = span*height/width/2;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    animate();
  }
  function sync(character) {
    if (!canvas.isConnected) return;
    selected = character;
    const buttons = [...stage.querySelectorAll('.zk-book')];
    if (buttons.length !== books.length || buttons.some((button, i) => button !== books[i].button)) {
      clearBooks();
      books = buttons.map(makeBook);
      resize();
    }
    animate();
  }
  stage.prepend(canvas, ink);
  stage.classList.add('zk-shelf-3d');
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  canvas.addEventListener('webglcontextlost', () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    width = height = 0;
    stage.classList.remove('zk-shelf-3d');
    canvas.remove();ink.remove();
  }, {once:true});
  return sync;
}
