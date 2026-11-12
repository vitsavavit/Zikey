async function createLibraryOverview(panel, characters, actions) {
  const T = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const stage = panel.querySelector('.zk-rotunda');
  const status = panel.querySelector('[role="status"]');
  const back = panel.querySelector('[data-library="back"]');
  const backPosition=document.createComment('library back button');
  back.before(backPosition);
  const panButton = panel.querySelector('[data-library="pan"]');
  const families=new Map(), radicals=new Map();
  for(const [character,entry] of Object.entries(characters)){
    const radical=entry.radical;
    const phonetic=entry.etymology?.phonetic;
    if(radical){
      if(!radicals.has(radical))radicals.set(radical,[]);
      radicals.get(radical).push(character);
    }
    if(phonetic&&phonetic!==character&&characters[phonetic]){
      if(!families.has(phonetic))families.set(phonetic,[phonetic]);
      families.get(phonetic).push(character);
    }
  }
  const bySize=(a,b)=>b[1].length-a[1].length;
  const otherFamilies=[...families].filter(([name])=>name!=='青').sort(bySize).slice(0,5);
  const groups=[['青',families.get('青')],...otherFamilies].map(([name,members])=>({name,type:'Sound family',members}));
  const linkedRadicals=new Set(groups[0].members.map(c=>characters[c].radical).filter(Boolean));
  for(const [name] of [...radicals].sort(bySize)){
    if(linkedRadicals.size>=18)break;
    linkedRadicals.add(name);
  }
  for(const name of linkedRadicals)groups.push({name,type:'Radical',members:radicals.get(name)});
  const reading=character=>characters[character]?.pinyin?.[0]||'';

  const renderer = new T.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden','true');
  const scene = new T.Scene(), content = new T.Group();
  scene.add(content);
  const camera = new T.PerspectiveCamera(40,.9,.1,100);
  const target = new T.Vector3();
  const pan = new T.Vector2();
  const ray = new T.Raycaster();
  const hitPoint = new T.Vector2();
  const volumes = [];
  const openBookParts = [];
  const projected = new T.Vector3();
  const box = new T.BoxGeometry(1,1,1);
  const face = new T.PlaneGeometry(1,1);
  const shelf = panel.closest('#workspace').querySelector('#book-shelf');
  const leather = getComputedStyle(shelf).getPropertyValue('--shelf-leather').trim().slice(5,-2);
  const atlas = await new T.TextureLoader().loadAsync(leather);
  atlas.colorSpace=T.SRGBColorSpace;
  const covers = groups.map((group,index)=>{
    const stamp=document.createElement('canvas');
    stamp.width=384;
    stamp.height=512;
    const ctx=stamp.getContext('2d');
    const tile=atlas.image.width/5;
    ctx.drawImage(atlas.image,(index%4+.18)*tile,.11*atlas.image.height,
      .68*tile,.78*atlas.image.height,0,0,384,512);
    ctx.font='bold 176px "Songti TC", serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.shadowColor='#180d05';
    ctx.shadowOffsetY=5;
    ctx.shadowBlur=5;
    const gilding=ctx.createLinearGradient(0,170,0,355);
    gilding.addColorStop(0,'#fff3c9');
    gilding.addColorStop(.5,'#eec377');
    gilding.addColorStop(1,'#b67a35');
    ctx.fillStyle=gilding;
    ctx.fillText(group.name,192,263);
    const texture=new T.CanvasTexture(stamp);
    texture.colorSpace=T.SRGBColorSpace;
    return new T.MeshBasicMaterial({map:texture});
  });
  const light=document.createElement('canvas');
  light.width=light.height=64;
  const lightCtx=light.getContext('2d');
  const falloff=lightCtx.createRadialGradient(32,32,0,32,32,32);
  falloff.addColorStop(0,'#fff4cc');
  falloff.addColorStop(.18,'#faca7eb0');
  falloff.addColorStop(1,'#faca7e00');
  lightCtx.fillStyle=falloff;
  lightCtx.fillRect(0,0,64,64);
  const glowTexture=new T.CanvasTexture(light);
  glowTexture.colorSpace=T.SRGBColorSpace;
  const glow=new T.SpriteMaterial({map:glowTexture,blending:T.AdditiveBlending,
    transparent:true,depthWrite:false});
  const spine=new T.CylinderGeometry(1,1,1,20);
  const dot = new T.SphereGeometry(.22,16,12);
  const palette = ['#294637','#20394f','#622e2a','#775126'].map(color=>new T.MeshBasicMaterial({color}));
  const paper = new T.MeshBasicMaterial({color:'#eed3a2'});
  const gold = new T.MeshBasicMaterial({color:'#bd8e45'});
  const faintThread = new T.MeshBasicMaterial({color:'#b08755',transparent:true,opacity:.30,depthWrite:false});
  const soundLink = new T.MeshBasicMaterial({color:'#906332'});
  const meaningLink = new T.MeshBasicMaterial({color:'#497452'});
  const componentLink = new T.MeshBasicMaterial({color:'#766b60'});
  const thread = new T.MeshBasicMaterial({color:'#ffdcaa'});
  stage.prepend(canvas);
  const labels = [];
  let active = null, cover = null, opening = 0, frame = 0;
  let azimuth = .08, elevation = .13, distance = 19;
  let pointer=null, focusBook=false, flight=null, lastFrame=0, yawSpeed=0, pitchSpeed=0;
  let overviewView=null, closing=null, networkKey=null;
  let returnBook=null, returningToBook=false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function mesh(parent,geometry,material,x,y,z,width=1,height=1,depth=1){
    const item = new T.Mesh(geometry,material);
    item.position.set(x,y,z);
    item.scale.set(width,height,depth);
    parent.add(item);
    return item;
  }
  function line(from,to,material=thread){
    const direction=to.clone().sub(from);
    const midpoint=from.clone().lerp(to,.5);
    const link=mesh(content,spine,material,...midpoint.toArray(),.016,direction.length(),.016);
    link.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());
    link.userData.link=true;
  }
  function spark(point,size){
    const sprite=new T.Sprite(glow);
    sprite.position.copy(point);
    sprite.scale.setScalar(size);
    content.add(sprite);
  }
  function label(point,title,subtitle,action,isBook=false){
    const element = document.createElement(action?'button':'span');
    element.className = action?'zk-rotunda-node':'zk-rotunda-edge';
    element.textContent = title;
    if(isBook){
      element.classList.add('zk-rotunda-book');
      if(title==='青'&&subtitle.includes('Sound family'))element.classList.add('zk-rotunda-hub');
      element.setAttribute('aria-label',`${title} ${subtitle}`);
      element.textContent='';
    }
    if(!action&&title==='via 請')element.classList.add('zk-rotunda-key-edge');
    if(action){
      element.type='button';
      const small=document.createElement('small');
      small.textContent=subtitle;
      if(isBook){
        element.title=subtitle;
        const pinyin=reading(title);
        const duplicate=groups.filter(group=>group.name===title).length>1;
        const kind=subtitle.includes('Sound family')?'Family':'Radical';
        small.textContent=pinyin&&duplicate?`${pinyin} · ${kind}`:pinyin||kind;
      }
      element.append(small);
      element.onclick=action;
    }
    stage.append(element);
    labels.push({point,element});
    return element;
  }
  function book(point,index){
    const material=palette[index%palette.length];
    const volume=new T.Group();
    volume.position.copy(point);
    volumes.push({volume,roll:index%2 ? .09 : -.07});
    if(index===0)volume.scale.setScalar(1.23);
    content.add(volume);
    mesh(volume,box,paper,.03,0,0,1.48,1.97,.40);
    mesh(volume,box,material,0,0,-.23,1.60,2.14,.10);
    mesh(volume,box,index===0?gold:material,0,0,.24,1.62,2.16,.10);
    mesh(volume,spine,material,-.73,0,0,.17,2.14,.29);
    for(const y of [-.78,-.38,.44,.8]){
      mesh(volume,spine,gold,-.73,y,0,.176,.034,.296);
    }
    mesh(volume,face,covers[index],.04,0,.30,1.42,2.02,1);
    if(index===0)spark(point.clone().add(new T.Vector3(0,0,-.42)),4.0);
  }
  function resetCamera(){
    flight=null;yawSpeed=pitchSpeed=0;pan.set(0,0);
    panButton.setAttribute('aria-pressed','false');
    azimuth=.08;elevation=active ? .32 : .13;distance=active ? 12 : 19;target.copy(content.position);
    schedule();
  }
  function approach(group,point){
    if(closing||flight)return;
    overviewView={target:target.clone(),pan:pan.clone(),distance,elevation,azimuth};
    yawSpeed=pitchSpeed=0;
    if(reduced.matches){pan.set(0,0);target.copy(point);distance=12;show(group,point);return;}
    flight={group,point,from:target.clone(),pan:pan.clone(),distance,elevation,start:performance.now()};
    status.textContent=`Approaching ${group.name} · ${group.type}`;
    schedule();
  }
  function show(group,point=new T.Vector3(),keepCamera=false){
    content.clear();
    volumes.length=0;
    openBookParts.length=0;
    content.position.copy(point);
    for(const {element} of labels)element.remove();
    labels.length=0;
    active=group;
    stage.classList.remove('zk-rotunda-paper');
    backPosition.after(back);
    back.textContent='All books';
    cover=null;
    opening=0;
    back.disabled=!group;
    if(!group){
      if(!keepCamera)resetCamera();
      const hub=new T.Vector3();
      const positions=groups.map((entry,index)=>{
        if(index===0)return hub;
        const tier=index<=7?0:index<=15?1:2;
        const slot=index-[1,8,16][tier];
        const count=Math.min([7,8,8][tier],groups.length-[1,8,16][tier]);
        const angle=slot*2*Math.PI/count+[.37,.1,.58][tier];
        const radius=tier===0?7.0:13.2;
        const height=tier===0?2.5*Math.sin(angle*2):tier===1?6.0:-5.5;
        return new T.Vector3(radius*Math.cos(angle),height,radius*Math.sin(angle));
      });
      groups.forEach((entry,index)=>{
        const location=positions[index];
        if(entry.type==='Sound family'){
          const neighbours=groups.map((candidate,i)=>({candidate,i,shared:entry.members.filter(c=>candidate.members.includes(c))}))
            .filter(({candidate,shared})=>candidate.type==='Radical'&&shared.length)
            .sort((a,b)=>b.shared.length-a.shared.length);
          for(const {i,shared} of neighbours.slice(0,index===0?6:2)){
            const neighbour=positions[i];
            line(location,neighbour,index===0?thread:faintThread);
            if(index===0){
              spark(location.clone().lerp(neighbour,.28),.48);
              spark(location.clone().lerp(neighbour,.79),.42);
            }
            if(index===0&&shared.includes('請'))label(location.clone().lerp(neighbour,.63),'via 請','',null);
          }
        }
        book(location,index);
        const subtitle=[reading(entry.name),entry.type,`${entry.members.length} characters`].filter(Boolean).join(' · ');
        label(location,entry.name,subtitle,()=>approach(entry,location),true);
      });
      status.textContent=`${groups.length} books. Gold links connect groups with shared characters.`;
      return;
    }
    schedule();
    const center=new T.Vector3(0,-1.45,0);
    openBookParts.push(mesh(content,box,palette[0],1.68,-1.45,0,3.36,.20,2.35),
      mesh(content,box,paper,1.63,-1.31,0,3.26,.16,2.23));
    cover=new T.Group();
    cover.position.copy(center);
    content.add(cover);
    openBookParts.push(mesh(cover,box,palette[0],1.68,.19,0,3.36,.14,2.35),
      mesh(cover,box,paper,1.63,.10,0,3.26,.12,2.23));
    const openCharacter=character=>{
      returnBook={group,point:point.clone()};
      actions.select(character);
    };
    const phonetic=group.type==='Sound family';
    const origin=new T.Vector3(0,.33,.48);
    if(!phonetic)mesh(content,dot,gold,...origin.toArray());
    const around=phonetic?group.members.filter(c=>c!==group.name):group.members;
    if(phonetic){
      mesh(content,dot,gold,...origin.toArray());
      label(origin,group.name,reading(group.name),()=>openCharacter(group.name));
    }
    around.forEach((c,index)=>{
      const angle=index*Math.PI*2/around.length;
      const point=new T.Vector3(3.9*Math.cos(angle),.65+2.05*Math.sin(angle),1.4*Math.sin(angle*2));
      line(origin,point);
      mesh(content,dot,gold,...point.toArray());
      label(point,c,reading(c),()=>openCharacter(c));
    });
    status.textContent=`${group.name} · ${group.type}. Choose a character for its reading, or tap the book to close.`;
    elevation=.32;
    back.focus();
  }
  function showNetwork(data){
    content.clear();
    content.position.set(0,0,0);
    volumes.length=0;
    openBookParts.length=0;
    for(const {element} of labels)element.remove();
    labels.length=0;
    active=null;cover=null;closing=null;opening=0;
    const onPaper=data.mode==='focus';
    stage.classList.toggle('zk-rotunda-paper',onPaper);
    if(onPaper)stage.append(back);
    else backPosition.after(back);
    back.textContent=returnBook?'Back to book':'Back to library';
    resetCamera();
    back.disabled=false;
    const positions=new Map();
    const neighbours=data.nodes.filter(node=>node.id!==data.selected);
    const addNode=(node,point)=>{
      positions.set(node.id,point);
      const subtitle=[node.pinyin,node.component?'Component':null,node.known?'Known':null].filter(Boolean).join(' · ');
      const button=label(point,node.id,subtitle,
        ()=>node.component?actions.component(node.id):actions.select(node.id));
      if(node.component)button.classList.add('zk-rotunda-component');
      if(node.recommended||node.id===data.selected)button.classList.add('zk-rotunda-highlight');
    };
    const selected=data.nodes.find(node=>node.id===data.selected);
    if(selected)addNode(selected,new T.Vector3(0,.35,.3));
    neighbours.forEach((node,index)=>{
      if(onPaper){
        const row=Math.floor(index/4);
        const count=Math.min(4,neighbours.length-row*4);
        const x=(index%4-(count-1)/2)*3.15;
        addNode(node,new T.Vector3(x,2.65+row*2.15,index%2?.45:-.4));
        return;
      }
      const row=Math.floor(index/8);
      const count=Math.min(8,neighbours.length-row*8);
      const angle=(index%8)*2*Math.PI/count+.45+row*.4;
      const radius=4.4+row*2.6;
      addNode(node,new T.Vector3(radius*Math.cos(angle),1.9+radius*.49*Math.sin(angle),Math.sin(angle*2)*1.7-row));
    });
    for(const link of data.links){
      const from=positions.get(link.source),to=positions.get(link.target);
      if(!from||!to)continue;
      const material=link.kinds.includes('Sound')?soundLink:
        link.kinds.includes('Meaning')?meaningLink:componentLink;
      line(from,to,material);
    }
    data.ring_words.forEach((word,index)=>{
      const row=Math.floor(index/3);
      const count=Math.min(3,data.ring_words.length-row*3);
      const x=(index%3-(count-1)/2)*3.5;
      const point=new T.Vector3(x,-2-row*2.15,.5);
      const missing=word.missing.length>0;
      const button=label(point,word.word,missing?'Need '+word.missing.join(' '):'Readable now',
        ()=>actions.word(word.word));
      button.classList.add('zk-rotunda-word',missing?'zk-rotunda-word-missing':'zk-rotunda-word-ready');
      const origin=positions.get(data.selected);
      if(origin){
        if(missing){
          for(let i=0;i<8;i++){
            line(origin.clone().lerp(point,i/8),origin.clone().lerp(point,(i+.52)/8),soundLink);
          }
        }else line(origin,point,meaningLink);
      }
    });
    status.textContent=selected
      ?[selected.id,selected.pinyin,characters[selected.id]?.definition].filter(Boolean).join(' · ')
      :data.mode==='search'?'Choose a character from the search results.':'Choose a character from this radical group.';
    schedule();
  }
  function update(data){
    const key=data.mode==='overview'?null:
      JSON.stringify([data.graph_key,data.selected,data.nodes,data.links,data.ring_words]);
    if(key!==networkKey){
      networkKey=key;
      if(key)showNetwork(data);
      else{
        const book=returningToBook?returnBook:null;
        returningToBook=false;
        returnBook=null;
        if(book){
          show(book.group,book.point);
          resetCamera();
        }else show(null);
      }
    }
    resize();
  }
  function draw(time){
    frame=0;
    const width=stage.clientWidth,height=stage.clientHeight;
    if(!width||!height)return;
    const elapsed=lastFrame?Math.min(40,time-lastFrame):16;
    lastFrame=time;
    if(flight){
      const progress=Math.min(1,(time-flight.start)/650);
      const ease=progress*progress*(3-2*progress);
      target.lerpVectors(flight.from,flight.point,ease);
      distance=T.MathUtils.lerp(flight.distance,12,ease);
      pan.copy(flight.pan).multiplyScalar(1-ease);
      elevation=T.MathUtils.lerp(flight.elevation,.32,ease);
      if(progress===1){
        const {group,point}=flight;
        flight=null;
        show(group,point);
      }
    }
    if(closing&&closing.returnStart!==null){
      const progress=T.MathUtils.clamp((time-closing.returnStart)/650,0,1);
      const ease=progress*progress*(3-2*progress);
      const {from,view}=closing;
      target.lerpVectors(from.target,view.target,ease);
      pan.lerpVectors(from.pan,view.pan,ease);
      distance=T.MathUtils.lerp(from.distance,view.distance,ease);
      azimuth=T.MathUtils.lerp(from.azimuth,view.azimuth,ease);
      elevation=T.MathUtils.lerp(from.elevation,view.elevation,ease);
      if(progress===1){closing=null;focusBook=true;}
    }
    if(!pointer&&!flight&&!closing&&!reduced.matches){
      azimuth+=yawSpeed*elapsed;
      elevation=T.MathUtils.clamp(elevation+pitchSpeed*elapsed,-.55,.85);
      const decay=Math.exp(-elapsed/240);
      yawSpeed*=decay;pitchSpeed*=decay;
    }
    const aspect=width/height;
    camera.aspect=aspect;
    const radius=distance*Math.max(1,1/aspect);
    camera.position.set(radius*Math.sin(azimuth)*Math.cos(elevation),radius*Math.sin(elevation),
      radius*Math.cos(azimuth)*Math.cos(elevation)).add(target);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8]-=pan.x;
    camera.projectionMatrix.elements[9]-=pan.y;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    for(const {volume,roll} of volumes){
      volume.lookAt(camera.position);
      volume.rotateY(.16);
      volume.rotateZ(roll);
    }
    const moving=cover&&!reduced.matches;
    if(moving&&!opening)opening=time;
    let progress=moving?Math.min(1,(time-opening)/480):1;
    if(closing&&cover){
      progress=closing.openFraction*Math.max(0,1-(time-closing.start)/400);
      if(progress===0){
        closing.returnStart=time;
        show(null,new T.Vector3(),true);
      }
    }
    if(cover)cover.rotation.z=Math.PI*(1-(1-progress)**3);
    content.children.forEach(item=>{
      if(active&&(item.userData.link||item.geometry===dot))item.visible=!closing&&progress>.7;
    });
    stage.style.setProperty('--rotunda-shift',`${50+Math.sin(azimuth)*5}%`);
    content.scale.x=stage.classList.contains('zk-rotunda-paper')?Math.max(1,Math.min(aspect,2.8)):1;
    renderer.render(scene,camera);
    for(const {point,element} of labels){
      projected.copy(point).applyMatrix4(content.matrixWorld).project(camera);
      const visible=(!closing||!active)&&(!cover||progress>.7)&&Math.abs(projected.x)<.98&&Math.abs(projected.y)<.94&&Math.abs(projected.z)<1;
      element.hidden=!visible;
      element.style.left=`${(projected.x+1)*50}%`;
      if(element.classList.contains('zk-rotunda-book')){
        const scale=height/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*
          Math.max(1,camera.position.distanceTo(point.clone().add(content.position))));
        element.style.width=`${Math.max(44,1.56*scale)}px`;
        element.style.height=`${Math.max(44,2.10*scale)}px`;
      }
      element.style.top=`${(1-projected.y)*50}%`;
    }
    if(focusBook){
      stage.querySelector('button:not([hidden])')?.focus();
      focusBook=false;
    }
    if(progress<1||flight||closing||(!pointer&&!reduced.matches&&Math.abs(yawSpeed)+Math.abs(pitchSpeed)>.00008))schedule();
    else lastFrame=0;
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  function zoom(factor){
    if(flight||closing)return;
    distance=T.MathUtils.clamp(distance*factor,9,42);
    schedule();
  }
  function resize(){renderer.setSize(stage.clientWidth,stage.clientHeight,false);schedule();}
  const observer=new ResizeObserver(resize);
  observer.observe(stage);
  stage.addEventListener('pointerdown',event=>{
    if(event.target.closest('button')||event.button!==0||flight||closing)return;
    yawSpeed=pitchSpeed=0;
    pointer={id:event.pointerId,x:event.clientX,y:event.clientY,time:event.timeStamp,movement:0};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove',event=>{
    if(pointer?.id!==event.pointerId)return;
    const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
    pointer.movement+=Math.hypot(dx,dy);
    if(event.shiftKey||panButton.getAttribute('aria-pressed')==='true'){
      pan.x=T.MathUtils.clamp(pan.x+2*dx/stage.clientWidth,-2.25,2.25);
      pan.y=T.MathUtils.clamp(pan.y-2*dy/stage.clientHeight,-2.25,2.25);
      yawSpeed=pitchSpeed=0;
    }
    else{
      const dt=Math.max(12,event.timeStamp-pointer.time);
      yawSpeed=T.MathUtils.clamp(-dx*.009/dt,-.009,.009);
      pitchSpeed=T.MathUtils.clamp(dy*.008/dt,-.006,.006);
      azimuth-=dx*.009;elevation=T.MathUtils.clamp(elevation+dy*.008,-.55,.85);
    }
    pointer.x=event.clientX;pointer.y=event.clientY;pointer.time=event.timeStamp;schedule();
  });
  stage.addEventListener('pointerup',event=>{
    if(pointer?.id!==event.pointerId||pointer.movement>6||!active)return;
    const rect=stage.getBoundingClientRect();
    hitPoint.set((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2);
    ray.setFromCamera(hitPoint,camera);
    if(ray.intersectObjects(openBookParts,false).length)closeBook();
  });
  stage.addEventListener('lostpointercapture',event=>{
    if(pointer&&event.timeStamp-pointer.time>90)yawSpeed=pitchSpeed=0;
    pointer=null;schedule();
  });
  stage.addEventListener('wheel',event=>{
    event.preventDefault();
    zoom(Math.exp(event.deltaY*.001));
  },{passive:false});
  stage.addEventListener('keydown',event=>{
    if(flight||closing)return;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft')azimuth+=.15;
    if(event.key==='ArrowRight')azimuth-=.15;
    if(event.key==='ArrowUp')elevation=Math.min(.85,elevation+.1);
    if(event.key==='ArrowDown')elevation=Math.max(-.55,elevation-.1);
    schedule();
  });
  panel.querySelector('[data-library="in"]').onclick=()=>zoom(.86);
  panel.querySelector('[data-library="out"]').onclick=()=>zoom(1.16);
  panel.querySelector('[data-library="reset"]').onclick=()=>{if(!closing)resetCamera();};
  panButton.onclick=()=>panButton.setAttribute('aria-pressed',String(panButton.getAttribute('aria-pressed')!=='true'));
  function closeBook(){
    if(!active||closing)return;
    const view=overviewView;
    if(reduced.matches){
      show(null,new T.Vector3(),true);
      target.copy(view.target);pan.copy(view.pan);
      ({distance,elevation,azimuth}=view);
      focusBook=true;schedule();
      return;
    }
    const start=performance.now();
    yawSpeed=pitchSpeed=0;
    closing={start,view,returnStart:null,openFraction:opening?Math.min(1,(start-opening)/480):0,
      from:{target:target.clone(),pan:pan.clone(),distance,elevation,azimuth}};
    back.disabled=true;
    status.textContent='Closing the book…';
    schedule();
  }
  back.onclick=()=>{
    if(!networkKey){closeBook();return;}
    returningToBook=Boolean(returnBook);
    actions.overview();
  };
  canvas.addEventListener('webglcontextlost',()=>{
    observer.disconnect();
    cancelAnimationFrame(frame);
    box.dispose();face.dispose();dot.dispose();spine.dispose();glowTexture.dispose();glow.dispose();paper.dispose();gold.dispose();thread.dispose();faintThread.dispose();soundLink.dispose();meaningLink.dispose();componentLink.dispose();atlas.dispose();
    covers.forEach(material=>{material.map.dispose();material.dispose();});
    palette.forEach(material=>material.dispose());
    renderer.dispose();
    canvas.remove();
    panel.dispatchEvent(new Event('library-context-lost'));
  },{once:true});
  show(null);
  return update;
}
