export default async function(component) {
  const d3=globalThis.d3, Plotly=globalThis.Plotly;
  const root=component.parentElement.querySelector('#workspace');
  if(!root) return;
  const $=id=>root.querySelector('#'+id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const palette={Novice:'#b7c9a7',A:'#b9cfd8',B:'#e6ca8b',C:'#d3bfca',Unknown:'#c7c4b7'};
  const signals=['prevalence','reuse','unlock','heat'], signalColors=['#4d7254','#526982','#916228','#81708f'];
  const S=root._workspace||(root._workspace={camera:{},positions:{},viewKey:null});
  S.data={...component.data,...libraryData};
  S.pending=false;root.setAttribute('aria-busy','false');
  S.lockedControls?.forEach(el=>el.disabled=false);
  S.send=action=>{
    if(S.pending)return;
    S.pending=true;root.setAttribute('aria-busy','true');
    S.lockedControls=[...root.querySelectorAll('button,input,select,textarea')].filter(el=>
      !el.disabled&&!el.matches('[data-expand],.zk-zoom button,.zk-close,#methods-button,#all-words'));
    S.lockedControls.forEach(el=>el.disabled=true);
    $('error').hidden=true;component.setTriggerValue('action',action);
  };
  const send=action=>S.send(action);
  const select=c=>send({type:'select',character:c});
  S.setFocus=panel=>{
    S.focus=panel;root.dataset.focus=panel;
    root.querySelectorAll('[data-expand]').forEach(b=>{
      const active=b.dataset.expand===panel;
      b.textContent=active?'Restore':'Expand';
      b.setAttribute('aria-label',active?'Return to workspace':'Expand '+b.dataset.expand);
      b.setAttribute('aria-pressed',String(active));
    });
    requestAnimationFrame(()=>S.resizeViews?.());
  };
  function gloss(w){
    if(w.sense_status==='Needs review'&&w.dictionary_readings.length){
      return `<p class="zk-source-note">Several readings or senses. Check the entries below.</p><ul class="zk-senses">${w.dictionary_readings.map(s=>`<li><span>${esc(s.pinyin)}</span> ${esc(s.meaning)}</li>`).join('')}</ul>`;
    }
    if(w.sense_status==='Missing dictionary entry')return '<p>No English entry in the current dictionary snapshot.</p>';
    return `<p class="zk-word-gloss">${esc(w.meaning)}</p>${w.sense_status.startsWith('Reading variant')?`<p class="zk-source-note">Pronunciation differs by source: TOCFL ${esc(w.pinyin)}; CC-CEDICT ${w.dictionary_readings.map(s=>esc(s.pinyin)).join(' / ')}. The matching meaning is shown.</p>`:''}`;
  }

  function wordDetails(word) {
    const w=S.data.words.find(w=>w.word===word); if(!w)return;
    const missing=[...new Set(w.word)].filter(c=>!S.data.known.includes(c));
    $('word-detail').innerHTML=`<h2 class="word-title" lang="zh-Hant">${esc(w.word)}</h2><p>${esc(w.pinyin)}</p>${gloss(w)}<p class="word-status">${missing.length ? missing.length+' distinct character(s) missing' : 'Readable now'}</p><div class="word-list"></div><p class="zk-muted">${[w.level,w.part_of_speech,w.sense_status].filter(Boolean).map(esc).join(' · ')}</p><details><summary>Dictionary senses & source</summary>${w.dictionary_readings.map(s=>`<p>${esc(s.pinyin)}: ${esc(s.meaning)}</p>`).join('')}<p class="zk-muted">TOCFL ${esc(w.sheet)}, row ${w.row}. English senses: CC-CEDICT.</p></details>`;
    for(const c of missing){const b=document.createElement('button');b.textContent=`Learn about ${c}`;b.onclick=()=>{$('word-dialog').close();select(c);};$('word-detail').querySelector('.word-list').append(b);}
    $('word-dialog').showModal();
  }
  function allWords() {
    const selected=S.data.selected, words=S.data.words.filter(w=>w.word.includes(selected));
    $('word-detail').innerHTML=`<h2>Words containing ${esc(selected)}</h2><div class="word-list"></div>`;
    const list=$('word-detail').querySelector('.word-list');
    for(const w of words){const missing=[...new Set(w.word)].filter(c=>!S.data.known.includes(c));const row=document.createElement('div');row.className='word-candidate';const b=document.createElement('button');b.textContent=w.word;b.onclick=()=>{ $('word-dialog').close();wordDetails(w.word);};const p=document.createElement('p');p.textContent=`${w.pinyin} · ${missing.length?missing.length+' missing: '+missing.join(' '):'Readable now'}`;const meaning=document.createElement('p');meaning.className='zk-word-preview';meaning.textContent=w.sense_status==='Needs review'?w.dictionary_readings.map(s=>s.meaning).join(' · '):w.meaning;const detail=document.createElement('div');detail.append(p,meaning);row.append(b,detail);list.append(row);}
    if(!words.length)list.textContent='No pilot vocabulary entry contains this structural character.';
    $('word-dialog').showModal();
  }
  if(!S.initialized){
    S.initialized=true;
    root.querySelectorAll('[data-expand]').forEach(b=>b.onclick=()=>S.setFocus(S.focus===b.dataset.expand?'':b.dataset.expand));
    root.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.focus&&!root.querySelector('dialog[open]'))S.setFocus('');});
    $('search-form').onsubmit=e=>{e.preventDefault();send({type:'search',query:$('query').value});};
    $('brand').onclick=e=>{e.preventDefault();S.setFocus('');send({type:'overview'});};
    $('overview').onclick=()=>send({type:'overview'});
    $('goal').onchange=()=>send({type:'goal',goal:$('goal').value});
    $('scope').onchange=()=>send({type:'scope',scope:$('scope').value});
    $('apply-known').onclick=()=>{send({type:'known',characters:$('known-editor').value});root.querySelector('.zk-known').open=false;};
    $('reset').onclick=()=>{S.camera={};S.positions={};S.graphKey=null;send({type:'reset'});};
    $('simulated').onchange=()=>send({type:'heat',enabled:$('simulated').checked});
    $('logging').onchange=()=>send({type:'logging',enabled:$('logging').checked});
    $('explain').onclick=()=>{
      if(S.pending||!S.data.selected)return;
      if(S.data.explanation_backend==='template'){
        $('rationale').textContent=S.data.template_rationale;
        $('ai-status').textContent='Template explanation · computed evidence · no AI request';
        return;
      }
      $('ai-status').textContent='Running the local model…';
      send({type:'explain'});
    };
    $('close-word').onclick=()=>$('word-dialog').close();
    $('close-methods').onclick=()=>$('methods-dialog').close();
    $('methods-button').onclick=()=>$('methods-dialog').showModal();
  }
  const D=S.data;
  $('query').value=D.query;$('goal').value=D.goal;$('scope').value=D.scope;
  $('scope').querySelector('option[value="This family"]').disabled=!D.family;
  $('known-count').textContent=`${D.known.length} known`;$('known-editor').value=D.known.join('');
  $('simulated').checked=D.simulated;$('logging').checked=D.logging;
  $('error').hidden=!D.error;$('error').textContent=D.error||'';
  $('heat-status').textContent=D.simulated?'SIMULATED counts · not community data':D.logging?`Local session totals · ${D.event_count} lookups`:'Heat unavailable until opt-in lookups; currently zero.';
  $('map-title').textContent=D.mode==='overview'?'Your Learning Library':D.mode==='radical'?`${D.radical} · radical group`:D.mode==='search'?'Search results':D.family?`${D.family.root} · sound family`:`${D.selected} · character structure`;
  $('map-description').textContent=D.mode==='overview'?'290 characters, grouped by dictionary radical. Choose a cluster or start with qing.':D.mode==='radical'?'Dictionary group, not a guaranteed meaning category. Select a character to explore.':D.mode==='search'?`${D.matches.length} exact pronunciation matches; different sound families may be represented.`:D.family?'Documented sound relationships. Modern readings and tones may differ.':'No documented sound family. Explore available structure and vocabulary.';
  $('map-hint').textContent=D.mode==='overview'?'Click a group to zoom · click a character to learn':'Ochre ring: recommended in '+D.scope.toLowerCase()+' · dashed words: one missing character';
  $('results').replaceChildren();
  if(D.query){
    if(!D.matches.length){const p=document.createElement('span');p.textContent='No pilot match. Try qing, shi or 請.';$('results').append(p);}
    for(const c of D.matches){const b=document.createElement('button');b.textContent=`${c} ${D.characters[c].pinyin.join('/')}`;b.setAttribute('aria-label',`Search result ${c}`);b.onclick=()=>select(c);$('results').append(b);}
  }else{const b=document.createElement('button');b.textContent='Start with qing';b.onclick=()=>send({type:'search',query:'qing'});$('results').append(b);}
  $('scope-label').textContent=D.scope==='This family'?`Best within ${D.family.root} family · ${D.rank_count} unknown`:`All ${D.rank_count} unknown characters${D.global_next?' · next '+D.global_next:''}`;
  $('book-shelf').hidden=!D.ranked.length;
  const shelfKey='open-pages:'+D.ranked.map(r=>r.character).join('');
  if(S.shelfKey!==shelfKey){
    S.shelfKey=shelfKey;
    $('book-shelf').innerHTML=D.ranked.map((r,i)=>`<button class="zk-book" data-character="${esc(r.character)}" data-cover="${i}" aria-label="Open recommended character ${esc(r.character)}"><span class="zk-book-volume" aria-hidden="true"><span class="zk-book-pages"><span class="zk-book-page-content"><span class="zk-book-character" lang="zh-Hant">${esc(r.character)}</span><span class="zk-book-reading">${esc(D.characters[r.character].pinyin[0]||'')}</span></span></span><span class="zk-book-spine"><span lang="zh-Hant">${esc(r.character)}</span></span><span class="zk-book-cover"></span></span></button>`).join('');
  }
  if(S.openBook!==D.selected||!D.ranked.some(r=>r.character===S.openBook))S.openBook=null;
  const updateBookShelf=()=>{
    $('book-shelf').querySelectorAll('button').forEach(b=>{
      const open=b.dataset.character===S.openBook;
      const reading=S.data.characters[b.dataset.character].pinyin[0];
      b.classList.toggle('active',open);
      b.setAttribute('aria-expanded',String(open));
      b.setAttribute('aria-pressed',String(b.dataset.character===S.data.selected));
      if(open&&reading)b.setAttribute('aria-description',`Pinyin: ${reading}`);
      else b.removeAttribute('aria-description');
    });
  };
  updateBookShelf();
  $('book-shelf').querySelectorAll('button').forEach(b=>{
    const reveal=()=>{if(b.classList.contains('active'))b.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'nearest'});};
    b.ontransitionend=e=>{if(e.target===b&&e.propertyName==='flex-basis')reveal();};
    if(S.bookFocus===b.dataset.character)b.focus({preventScroll:true});
    b.onclick=e=>{
      if(S.pending)return;
      S.openBook=b.dataset.character;
      updateBookShelf();
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(reveal);
      if(S.data.selected!==S.openBook){
        S.bookFocus=e.detail===0?S.openBook:null;
        send({type:'select_book',character:S.openBook});
      }
    };
  });
  S.bookFocus=null;
  $('rankings').innerHTML=D.ranked.map((r,i)=>`<button class="zk-rank ${r.character===D.selected?'active':''}" data-character="${esc(r.character)}" aria-label="Recommendation ${i+1}: ${esc(r.character)}"><span class="character">${esc(r.character)}</span><span class="reading">${esc(D.characters[r.character].pinyin.join('/'))}</span><span class="score">${r.score.toFixed(3)}</span><span class="bar">${signals.map((s,j)=>`<i style="width:${r.parts[s]*100}%;background:${signalColors[j]}"></i>`).join('')}</span></button>`).join('')||'<p class="zk-muted">No unknown characters in this scope. Choose Overall or edit known characters.</p>';
  $('rankings').querySelectorAll('button').forEach(b=>b.onclick=()=>select(b.dataset.character));
  $('selected-score').textContent=D.selected?`${D.selected} · ${D.selected_known?'already known':D.selected_score?'score '+D.selected_score.score.toFixed(3):'not ranked'} · +${D.unlocks.length} readable entries`: 'Select a character to inspect its score and words.';
  $('rationale').textContent=D.rationale;
  $('explain').disabled=!D.selected;$('explain').textContent=D.explanation_backend==='ollama'?'Explain with local AI':'Explain recommendation';
  $('ai-status').textContent=D.ai_status;
  $('weight-controls').innerHTML=signals.map((s,i)=>`<label class="zk-weight"><span>${['Prevalence','Reuse','Unlock','Heat'][i]}</span><input type="range" min="0" max="100" value="${D.weights[i]}" aria-label="${s} weight"><output>${D.weights[i]}</output></label>`).join('');
  $('weight-controls').querySelectorAll('input').forEach(input=>{input.oninput=()=>input.nextElementSibling.value=input.value;input.onchange=()=>send({type:'weights',weights:[...$('weight-controls').querySelectorAll('input')].map(x=>+x.value)});});
  if(D.selected){
    const e=D.characters[D.selected], et=e.etymology||{}, evidence=e.band_evidence;
    $('selection').innerHTML=`<span class="zk-glyph" lang="zh-Hant">${esc(D.selected)}</span><div class="zk-char-info"><p class="zk-reading">${esc(e.pinyin.join(' / '))}</p><p class="zk-definition" title="${esc(e.definition)}">${esc(e.definition||'Definition unavailable')}</p><p>${et.phonetic?`Sound: ${esc(et.phonetic)}`:'Sound component unavailable'}${et.semantic?` · Meaning: ${esc(et.semantic)}`:''}</p><p>Radical ${esc(e.radical)} · ${evidence?`Band from ${esc(evidence.word)} (${esc(evidence.level)})`:'Band unknown'}</p><button id="all-words">${D.related_count} related words</button></div><button id="mark-known">${D.selected_known?'Unmark as known':'Mark as known'}</button>`;
    $('mark-known').onclick=()=>send({type:'mark'});$('all-words').onclick=allWords;
  }else{$('selection').innerHTML='<div class="zk-char-info"><p class="zk-reading">A connected path into Chinese</p><p>Search a sound you can read. Inspect a character, discover its words, then choose what to learn next.</p><p>Solid word outline: readable now · dashed: one character missing. Clicking never marks a character known.</p></div>';}
  $('dataset-summary').textContent=`290 characters · 450 vocabulary entries · ${D.radical_count} radical groups · local prototype`;
  $('methods-detail').innerHTML=`<p>Source snapshots: TOCFL workbook 20240923, Make Me a Hanzi dictionary, CC-CEDICT. Source URLs, hashes and licenses are preserved locally.</p><p>Node colour is derived from the earliest pilot word containing that character, not an official character level. Size counts pilot vocabulary prevalence, not corpus frequency. Layout proximity is not linguistic similarity.</p><p>The deterministic score sums globally max-normalized prevalence, IDS leaf-component reuse, unlock gain and heat with the displayed weights. Family recommendations filter the same global scores. All-zero weights use Default.</p><p>Solid lines: source decomposition leaf parts. Ochre: documented sound component. Green: documented meaning component. Multiple kinds on a pair share a display edge. Typed display relations never alter scoring edges.</p><p>The local LLM selects up to two exact evidence sentences. Unsupported output is rejected. It never changes ranking. A labelled template is used when the service fails.</p><p>Coverage is the percentage of these 450 vocabulary entries whose distinct characters are all known, recomputing each learning step. It is not corpus text coverage or proof of learning effectiveness.</p><p>${D.quality.missing_word_meaning.length} missing dictionary entries · ${D.quality.sense_review_needed.length} entries need sense review · ${D.quality.missing_etymology} missing origins. Alternatives are visible in word details.</p><p>Lookup logging is opt-in and session-only; no names or free-text queries are stored. Simulated heat is labelled and never mixed with real counts. No ALS has been trained.</p><p>AI disclosure: Codex assisted development, tests and presentation. Ollama qwen2.5-coder:7b performs local evidence selection. Learner and linguistic review remain pending.</p><p><a href="https://tocfl.edu.tw/tocfl/index.php/exam/download" target="_blank" rel="noopener">TOCFL</a> · <a href="https://github.com/skishore/makemeahanzi" target="_blank" rel="noopener">Make Me a Hanzi</a> · <a href="https://www.mdbg.net/chinese/dictionary?page=cc-cedict" target="_blank" rel="noopener">CC-CEDICT</a></p>`;
  $('coverage-now').textContent=`${D.coverage.toFixed(1)}% now`;
  $('coverage-note').textContent=`${D.known.length} known at start · after ${D.curves['My goal'].length-1} additional: ${D.curves['My goal'].at(-1).toFixed(1)}% · vocabulary order baseline, not textbook.`;
  const plot=$('coverage-plot');
  const chartKey=JSON.stringify(D.curves);
  if(S.chartKey!==chartKey){
    S.chartKey=chartKey;
    const chartData=Object.entries(D.curves).map(([name,values],i)=>({x:values.map((_,n)=>n),y:values,name,mode:'lines',line:{color:['#7e8783','#4d7254','#526982'][i],width:2,dash:name==='Default'?'dash':'solid'},hovertemplate:`${name}: %{y:.1f}%<extra></extra>`}));
    Plotly.react(plot,chartData,{width:plot.clientWidth||undefined,height:plot.clientHeight||undefined,margin:{l:32,r:6,t:8,b:48},paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{family:'Avenir Next, Helvetica Neue, sans-serif',color:'#675f52',size:S.focus==='coverage'?14:11},xaxis:{title:{text:'Additional characters learned',font:{size:10}},gridcolor:'#d1c3a9',zeroline:false},yaxis:{range:[0,100],ticksuffix:'%',gridcolor:'#d1c3a9',zeroline:false},legend:{orientation:'h',y:-.38,font:{size:10}},showlegend:true,uirevision:'coverage'}, {displayModeBar:false,responsive:true}).catch(error=>{S.chartKey=null;console.error(error);});
  }

  const graphKey=JSON.stringify([D.graph_key,D.mode,D.selected,D.family,D.nodes,D.links,D.ring_words,D.heat_active,D.max_heat]);
  if(S.graphKey===graphKey)return;
  const narrow=$('galaxy').clientWidth<600;
  const viewKey=D.graph_key+(narrow?':narrow':'');
  let nodes=D.nodes.map(n=>({...n})), cluster=[];
  if(D.mode==='overview'){
    const groups=d3.group(nodes,n=>n.radical||'?');
    const hierarchy=d3.hierarchy({children:[...groups].map(([radical,children])=>({radical,children}))}).sum(n=>n.id?Math.max(1,n.prevalence):0).sort((a,b)=>b.value-a.value);
    d3.pack().size([980,610]).padding(6)(hierarchy);
    cluster=hierarchy.children.map(g=>({id:g.data.radical,x:g.x+10,y:g.y+10,r:g.r,n:g.children.length}));
    nodes=hierarchy.leaves().map(n=>({...n.data,x:n.x+10,y:n.y+10,r:Math.max(3,n.r-1)}));
  }else{
    const learning=nodes.filter(n=>D.mode==='focus'?(D.family?D.family.members.includes(n.id):n.id===D.selected):!n.component),center=D.family?.root||D.selected;
    const primary=learning.filter(n=>n.id!==center);
    nodes.forEach(n=>{
      if(n.id===center){n.x=500;n.y=300;n.r=18+Math.sqrt(n.prevalence)*2;}
      else if(primary.some(c=>c.id===n.id)){const i=primary.findIndex(c=>c.id===n.id),angle=-Math.PI/2+i*2*Math.PI/Math.max(1,primary.length);n.x=500+150*Math.cos(angle);n.y=300+150*Math.sin(angle);n.r=18+Math.sqrt(n.prevalence)*2;}
    });
    if(D.mode==='radical'||D.mode==='search'){
      const cols=Math.max(1,Math.ceil(Math.sqrt(nodes.length*1.6)));nodes.forEach((n,i)=>{n.x=120+(i%cols)*760/Math.max(1,cols-1);n.y=140+Math.floor(i/cols)*300/Math.max(1,Math.ceil(nodes.length/cols)-1);n.r=24;});
    }else{
      const selected=nodes.find(n=>n.id===D.selected)||{x:500,y:300};
      nodes.filter(n=>n.id!==center&&!learning.some(c=>c.id===n.id)).forEach((n,i)=>{const angle=Math.atan2(selected.y-300,selected.x-500)+i*1.2;n.x=Math.max(65,Math.min(935,selected.x+220*Math.cos(angle)));n.y=Math.max(60,Math.min(570,selected.y+200*Math.sin(angle)));n.r=21;});
    }
  }
  const container=$('galaxy');
  if(!S.svg){
    S.svg=d3.select(container).append('svg').attr('viewBox','0 0 1000 650').attr('role','group').attr('aria-label','Interactive learning library');
    S.layer=S.svg.append('g');
    S.zoom=d3.zoom().extent([[0,0],[1000,650]]).scaleExtent([.6,7]).on('zoom',event=>{S.layer.attr('transform',event.transform);S.camera[S.viewKey]={x:event.transform.x,y:event.transform.y,k:event.transform.k};S.layer.selectAll('.overview-label').attr('opacity',n=>S.data.mode!=='overview'||n.r*event.transform.k>=10?1:0);});
    S.svg.call(S.zoom).on('dblclick.zoom',null);
    $('zoom-in').onclick=()=>S.svg.call(S.zoom.scaleBy,1.35);$('zoom-out').onclick=()=>S.svg.call(S.zoom.scaleBy,1/1.35);$('fit').onclick=()=>S.svg.call(S.zoom.transform,d3.zoomIdentity);
  }
  S.viewKey=viewKey;S.layer.selectAll('*').remove();
  S.svg.attr('viewBox','0 0 1000 650');S.zoom.extent([[0,0],[1000,650]]);
  const camera=S.camera[viewKey]||{x:0,y:0,k:1};S.svg.call(S.zoom.transform,d3.zoomIdentity.translate(camera.x,camera.y).scale(camera.k));
  S.layer.append('g').selectAll('circle').data(cluster.filter(g=>g.n>1)).join('circle').attr('class','radical-group').attr('data-radical',g=>g.id).attr('cx',g=>g.x).attr('cy',g=>g.y).attr('r',g=>g.r).attr('fill','#eeeee6').attr('stroke','#899b91').attr('stroke-width',1).attr('tabindex',0).attr('role','button').attr('aria-label',g=>`Explore radical ${g.id}, ${g.n} characters`).on('click',(e,g)=>send({type:'radical',radical:g.id})).on('keydown',(e,g)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();send({type:'radical',radical:g.id});}});
  S.layer.append('g').selectAll('text').data(cluster.filter(g=>g.r>38)).join('text').attr('x',g=>g.x).attr('y',g=>g.y-g.r+14).attr('text-anchor','middle').attr('fill','#675f52').attr('font-size',12).text(g=>`${g.id} · ${g.n}`).style('pointer-events','none');
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const links=D.links.filter(l=>byId.has(l.source)&&byId.has(l.target));
  S.layer.append('g').selectAll('path').data(links).join('path').attr('fill','none').attr('d',l=>{const a=byId.get(l.source),b=byId.get(l.target);return `M${a.x},${a.y} Q${(a.x+b.x)/2+7},${(a.y+b.y)/2-5} ${b.x},${b.y}`;}).attr('stroke-linecap','round').attr('stroke',l=>l.kinds.includes('Sound')?'#916228':l.kinds.includes('Meaning')?'#4d7254':'#7c8589').attr('stroke-width',l=>l.kinds.includes('Sound')?2.5:1.5).attr('stroke-opacity',.8).append('title').text(l=>`${l.source} → ${l.target}: ${l.kinds.join(', ')} · Make Me a Hanzi`);
  const glyphs=S.layer.append('g').selectAll('g').data(nodes).join('g').attr('class','character-node').attr('data-character',n=>n.id).attr('transform',n=>`translate(${n.x},${n.y})`).attr('tabindex',0).attr('role','button').attr('aria-label',n=>`Select ${n.id}${n.known?', known':''}${n.component?', structural component':''}`);
  glyphs.filter(n=>!n.component).append('circle').attr('r',n=>n.r).attr('fill',n=>palette[n.band]||palette.Unknown).attr('fill-opacity',n=>D.heat_active ? .65+.35*n.heat/Math.max(1,D.max_heat):1).attr('stroke',n=>n.recommended?'#916228':n.id===D.selected?'#4a3524':'#71867e').attr('stroke-width',n=>n.recommended||n.id===D.selected?3:1);
  glyphs.filter(n=>!n.component&&n.r>=8).append('ellipse').attr('class','sketch-contour')
    .attr('rx',n=>n.r+1.8).attr('ry',n=>n.r-1.1).attr('transform','rotate(-7)')
    .attr('fill','none').attr('stroke','#554f43').attr('stroke-width',.65)
    .attr('stroke-opacity',.65).style('pointer-events','none');
  glyphs.filter(n=>n.component).append('path').attr('d',n=>`M0,${-n.r-4} L${n.r+4},0 L0,${n.r+4} L${-n.r-4},0 Z`).attr('fill','#fffaf0').attr('stroke','#778b8b').attr('stroke-width',1.5);
  glyphs.filter(n=>n.id===D.selected&&n.recommended).append('circle').attr('r',n=>n.r+5).attr('fill','none').attr('stroke','#4a3524').attr('stroke-width',1.5);
  glyphs.append('text').attr('class','overview-label').attr('opacity',n=>D.mode!=='overview'||n.r*camera.k>=10?1:0).attr('text-anchor','middle').attr('dy','.35em').attr('fill',n=>n.component?'#332e27':'#332e27').attr('font-size',n=>D.mode==='overview'?Math.min(20,n.r*1.25):26).attr('font-family','"Songti TC","Songti SC",serif').text(n=>n.id).style('pointer-events','none');
  if(D.mode!=='overview')glyphs.append('text').attr('font-family','Avenir Next, Helvetica Neue, sans-serif').attr('text-anchor','middle').attr('dy',n=>n.r+18).attr('fill','#675f52').attr('font-size',12).text(n=>n.pinyin||'component');
  glyphs.filter(n=>n.known&&n.r>=8).append('path').attr('d','M -3 0 L 0 3 L 5 -3').attr('transform',n=>`translate(${n.r-3},${-n.r+2})`).attr('fill','none').attr('stroke','#4a3524').attr('stroke-width',2.5);
  glyphs.append('title').text(n=>`${n.id} ${n.pinyin}\n${n.prevalence} pilot entries\n${n.band_evidence?`Derived band: ${n.band_evidence.word} (${n.band_evidence.level})`:'Structural component'}${n.component?'\nOutside the learning set':''}`);
  function choose(e,n){e.stopPropagation();if(n.component){$('word-detail').innerHTML=`<h2 class="word-title">${esc(n.id)}</h2><p>Documented structural context outside the 290-character learning set. It is not a recommendation candidate and cannot be marked known here.</p>`;$('word-dialog').showModal();}else select(n.id);}
  glyphs.on('click',choose).on('keydown',(e,n)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(e,n);}});
  const selectedNode=byId.get(D.selected), displayedWords=[];
  if(selectedNode&&D.mode==='focus'){
    for(const w of D.ring_words){
      let spot=null;
      for(const radius of [105,150,195]){
        for(let i=0;i<12;i++){const a=-Math.PI/2+i*Math.PI/6,x=selectedNode.x+radius*Math.cos(a),y=selectedNode.y+radius*Math.sin(a);
          if(x<65||x>935||y<25||y>610)continue;
          if(nodes.some(n=>Math.abs(n.x-x)<n.r+85&&Math.abs(n.y+15-y)<n.r+55))continue;
          if(displayedWords.some(n=>Math.abs(n.x-x)<150&&Math.abs(n.y-y)<75))continue;
          spot={...w,x,y};break;
        }if(spot)break;
      }if(spot)displayedWords.push(spot);
    }
    const layer=S.layer.append('g');
    layer.selectAll('line').data(displayedWords).join('line').attr('x1',selectedNode.x).attr('y1',selectedNode.y).attr('x2',w=>w.x).attr('y2',w=>w.y).attr('stroke','#9aa7a0').attr('stroke-dasharray','2 5');
    const pills=layer.selectAll('g').data(displayedWords).join('g').attr('class','word-node').attr('data-word',w=>w.word).attr('transform',w=>`translate(${w.x},${w.y})`).attr('role','button').attr('tabindex',0).attr('aria-label',w=>`Word ${w.word}, ${w.missing.length?'one character missing':'readable now'}`);
    pills.append('rect').attr('x',-56).attr('y',-19).attr('width',112).attr('height',38).attr('rx',2).attr('fill','#fffaf0').attr('stroke',w=>w.missing.length?'#778b8b':'#4d7254').attr('stroke-dasharray',w=>w.missing.length?'5 3':null);
    pills.append('text').attr('class','word-label').attr('text-anchor','middle').attr('dy',-1).attr('fill','#332e27').attr('font-size',15).text(w=>w.word);
    pills.append('text').attr('class','word-status-label').attr('font-family','Patrick Hand, Avenir Next, sans-serif').attr('text-anchor','middle').attr('dy',13).attr('fill','#675f52').attr('font-size',8).text(w=>w.missing.length?'Need '+w.missing.join(' '):'Readable now');
    pills.on('click',(e,w)=>wordDetails(w.word)).on('keydown',(e,w)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();wordDetails(w.word);}});
  }
  S.frame=()=>{
    if(!container.clientWidth||!container.clientHeight)return;
    const compact=container.clientWidth<600, key=D.graph_key+(compact?':narrow':'');
    S.svg.attr('viewBox','0 0 1000 650');S.zoom.extent([[0,0],[1000,650]]);
    if(S.viewKey!==key){
      S.viewKey=key;
      const saved=S.camera[key]||{x:0,y:0,k:1};
      S.svg.call(S.zoom.transform,d3.zoomIdentity.translate(saved.x,saved.y).scale(saved.k));
    }
    glyphs.select('.overview-label').attr('font-size',n=>D.mode==='overview'?Math.min(20,n.r*1.25):26);
    glyphs.selectAll('text:not(.overview-label)').attr('font-size',12);
    S.layer.selectAll('.word-label').attr('font-size',15).attr('dy',-1);
    S.layer.selectAll('.word-status-label').attr('font-size',8).attr('dy',13);
    S.layer.selectAll('.word-node rect').attr('x',-56).attr('y',-19).attr('width',112).attr('height',38);
    if(D.mode==='focus'){
      let box=S.layer.node().getBBox();
      const scale=Math.min(container.clientWidth/(box.width+56),container.clientHeight/(box.height+56));
      glyphs.select('.overview-label').attr('font-size',Math.max(26,22/scale));
      glyphs.selectAll('text:not(.overview-label)').attr('font-size',Math.max(12,12/scale));
      S.layer.selectAll('.word-label').attr('font-size',Math.max(15,15/scale)).attr('dy',-4/scale);
      S.layer.selectAll('.word-status-label').attr('font-size',Math.max(8,11/scale)).attr('dy',13/scale);
      const width=Math.max(112,76/scale),height=Math.max(38,42/scale);
      S.layer.selectAll('.word-node rect').attr('x',-width/2).attr('y',-height/2).attr('width',width).attr('height',height);
      box=S.layer.node().getBBox();
      S.svg.attr('viewBox',`${box.x-28} ${box.y-28} ${box.width+56} ${box.height+56}`);
      S.zoom.extent([[box.x-28,box.y-28],[box.x+box.width+28,box.y+box.height+28]]);
    }
  };
  if(!S.resizeObserver){S.resizeObserver=new ResizeObserver(()=>requestAnimationFrame(()=>S.resizeViews?.()));S.resizeObserver.observe(container);S.resizeObserver.observe($('coverage-plot'));}
  S.resizeViews=()=>{
    S.frame();
    const plot=$('coverage-plot');
    const fontSize=S.focus==='coverage'?14:11;
    if(plot.clientWidth&&plot.layout&&(plot.layout.width!==plot.clientWidth||
        plot.layout.height!==plot.clientHeight||plot.layout.font?.size!==fontSize)){
      Plotly.relayout(plot,{width:plot.clientWidth,height:plot.clientHeight,'font.size':fontSize});
    }
  };
  if(root.dataset.focus===undefined)S.setFocus('');
  S.frame();
  S.graphKey=graphKey;
}

