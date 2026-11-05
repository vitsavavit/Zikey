import fs from 'node:fs/promises';

const root = '/Users/7svv/Info-viz/zikey';
const ink = '#192F40', teal = '#147D78', muted = '#536372', paper = '#F7F8F5';
const sourceNotes = 'Sources: TOCFL 20240923 workbook, https://tocfl.edu.tw/tocfl/index.php/exam/download ; Make Me a Hanzi, https://github.com/skishore/makemeahanzi ; CC-CEDICT snapshot 2026-11-04, https://www.mdbg.net/chinese/dictionary?page=cc-cedict . Local data/processed/sources.json records snapshot hashes and terms.';

export async function build(presentation, {embedImages=false}={}) {
  if (presentation.slides.items.length) throw new Error('Refusing to append to a nonempty deck.');
  const evidence = JSON.parse(await fs.readFile(`${root}/deliverables/presentation-evidence.json`, 'utf8'));
  const quality = JSON.parse(await fs.readFile(`${root}/data/processed/quality_report.json`, 'utf8'));
  presentation.theme.defaultFont = 'Arial';

  function text(slide, value, x, y, w, h, size=24, color=ink, bold=false, font='Arial') {
    const shape=slide.shapes.add({geometry:'textbox', position:{left:x,top:y,width:w,height:h},
      fill:'none',line:{fill:'none',width:0}});
    shape.text=value;
    shape.text.style={fontFamily:font,fontSize:size,color,bold};
    return shape;
  }
  function slide(title, number, notes) {
    const s=presentation.slides.add({width:1280,height:720,background:{fill:paper}});
    text(s,title,64,44,1152,78,42,ink,true);
    text(s,`ZIKEY   /   Progress demonstration   /   5 November 2026`,64,670,1060,24,15,muted);
    text(s,String(number).padStart(2,'0'),1160,666,56,32,20,teal,true);
    s.speakerNotes.text=notes;
    return s;
  }
  async function image(slide,path,x,y,w,h,alt) {
    const bytes=embedImages ? await fs.readFile(path) : null;
    const source=bytes ? {blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:'image/png'} : {path};
    slide.images.add({...source,alt,fit:'contain',position:{left:x,top:y,width:w,height:h}});
  }

  const s1=slide('ZIKEY',1,'Lin Wei-De, W16157093. This is a working proof of concept for the approved proposal. The user starts with pinyin, explores characters and words, and steers a transparent recommendation. The image is a screenshot of the actual local D3 component, not a generated mockup. AI use disclosure: Codex assisted with code, tests and this deck. Student review remains necessary.');
  text(s1,'Seeing and steering\nyour next character',64,154,550,148,46,ink,true);
  text(s1,'Self-study offers long vocabulary lists.\nLearners need connected steps and\nreasons they can inspect.',64,330,540,120,27,muted);
  text(s1,'A working interactive prototype',64,506,550,42,28,teal,true);
  text(s1,'Lin Wei-De   W16157093\nInformation Visualization, NCKU',64,564,550,66,21,muted);
  await image(s1,`${root}/deliverables/network-actual.png`,650,152,560,440,'Actual local character network with 請 selected');

  const s2=slide('Real data in a bounded pilot',2,`${sourceNotes}\n450 unique Chinese word forms were selected using forced demonstration entries followed by earliest official level/source rows that fit 290 learning characters. Slash alternatives were expanded. Annotated and non-CJK entries were excluded, with counts retained. TOCFL is a public download but no open redistribution license was identified. This bundle stays local for coursework.`);
  text(s2,'290 characters     450 vocabulary entries     556 graph edges',64,142,1152,52,30,teal,true);
  const table=s2.tables.add({rows:4,columns:3,left:64,top:226,width:1152,height:252,
    columnWidths:[270,490,392],values:[['Source','Fields used','Snapshot / attribution'],
    ['TOCFL','Traditional words, pinyin, level','Workbook dated 2024-09-23'],
    ['Make Me a Hanzi','Components, radical, origin hints','LGPL v3+ dictionary'],
    ['CC-CEDICT','English word meanings','2026-11-04 / CC BY-SA 4.0']]});
  table.borders.assign({style:'solid',fill:'#DCE4DF',width:1});
  table.cells.block({row:0,column:0,rowCount:4,columnCount:3}).assign({
    fill:paper,textStyle:{fontFamily:'Arial',fontSize:23,color:ink},margins:{left:14,right:14,top:12,bottom:12}});
  table.cells.block({row:0,column:0,rowCount:1,columnCount:3}).assign({fill:'#E7EEEA',textStyle:{bold:true,color:ink,fontFamily:'Arial',fontSize:23}});
  text(s2,`${quality.missing_word_meaning.length} missing English glosses   /   ${quality.missing_etymology} missing origin records`,64,520,1152,42,25,ink,true);
  text(s2,'Missing fields stay visible. Vocabulary prevalence serves as a labelled proxy for corpus frequency.',64,578,1115,66,24,muted);

  const s3=slide('Local system and data flow',3,`${sourceNotes}\nImplementation: Python / pandas / NetworkX for processing and deterministic scoring. Streamlit session state synchronizes selection and known characters. A bidirectional D3 v7 component sends selected character events to Python. Plotly renders weighted contributions and recomputed coverage. Ollama qwen2.5-coder:7b selects evidence locally. No cloud LLM or paid API. Local lookup logging is opt-in, session-only and does not retain names or free-text queries. Model outputs are cached locally.`);
  const rows=[['01','Preserved source snapshots','Process once into characters, words and leaf-component edges.'],
    ['02','Inspectable recommendation','Compute four signals from the current known-character set.'],
    ['03','Three linked views','D3 network, score breakdown and Plotly coverage comparison.'],
    ['04','On-device explanation','Ollama selects up to two supported evidence sentences.']];
  rows.forEach((r,i)=>{const y=152+i*112;text(s3,r[0],64,y,70,52,34,teal,true);text(s3,r[1],164,y,1030,42,29,ink,true);text(s3,r[2],164,y+45,1030,52,24,muted);});
  text(s3,'One shared selection and known-character set connect the entire page.',64,618,1152,32,24,teal,true);

  const s4=slide('Four inspectable scoring signals',4,`${sourceNotes}\nSource: deliverables/presentation-evidence.json, computed by core.py. This native editable chart shows the five highest scores for the sample learner, Default weights. Each raw signal is divided by its maximum over currently unknown candidates, then multiplied by the normalized weight. Default weights: prevalence 35%, component reuse 25%, unlock gain 40%, heat 0%. Reuse counts named leaf parts in flattened IDS expressions, not necessarily immediate top-level parts. Heat starts at zero. No ALS or collaborative filtering was trained.`);
  text(s4,'Default weights: prevalence 35%, reuse 25%, unlock 40%, heat 0%',64,140,1152,42,25,muted);
  const signals=['prevalence','reuse','unlock','heat'];
  const names=['Vocabulary prevalence','Component reuse','Unlock gain','Heat'];
  const colors=['#147D78','#537FBA','#C67D43','#9277A9'];
  s4.charts.add('bar',{position:{left:64,top:220,width:770,height:350},
    categories:['Dian','Xue','Xin','Men','Nu'],
    series:signals.map((signal,i)=>({name:names[i],values:evidence.top_default.map(r=>Number(r.parts[signal].toFixed(6))),fill:colors[i]})),
    barOptions:{direction:'bar',grouping:'stacked',overlap:100},hasLegend:true,
    legend:{position:'bottom',textStyle:{fontFamily:'Arial',fontSize:17,color:muted}},
    xAxis:{textStyle:{fontFamily:'Arial',fontSize:20,color:ink}},
    yAxis:{min:0,max:1,majorUnit:0.2,numberFormatCode:'0.0',title:'Weighted score',textStyle:{fontFamily:'Arial',fontSize:18,color:muted}},chartFill:paper,plotAreaFill:paper});
  text(s4,'Unlock example',884,235,330,42,28,teal,true);
  text(s4,'請問',884,296,300,72,48,ink,true,'PingFang TC');
  text(s4,'Learning 請 unlocks this\nentry only when 問 is\nalready known.',884,388,310,136,25,ink,false,'PingFang TC');
  text(s4,'The LLM explains evidence. The numeric ranking comes from the displayed score.',64,603,1152,48,24,muted);

  const s5=slide('Linked exploration and steering',5,'Actual browser screenshot: local ZIKEY app with 請 selected. The full page also includes character meanings, a known-character toggle, local explanation and a coverage chart below the captured area. Demo path: search qing, click 請 in the graph, inspect its sound and meaning parts, request a local explanation, change the goal, mark/unmark 請, then inspect updated vocabulary coverage. The captioned video is a recording of these actual UI interactions.');
  await image(s5,`${root}/deliverables/workspace-actual.png`,64,145,780,478,'Actual linked network and recommendation workspace');
  text(s5,'Search and select',896,160,320,42,27,teal,true);
  text(s5,'A graph click updates the\nselected character everywhere.',896,211,310,95,24,ink);
  text(s5,'Steer the next step',896,338,320,42,27,teal,true);
  text(s5,'Change the goal or weights.\nMark a character as known.\nRecompute what becomes readable.',896,390,310,138,24,ink);
  text(s5,'All screenshots show the running application.',64,628,1152,28,19,muted);

  const s6=slide('Coverage comparison and validation',6,`Source: deliverables/presentation-evidence.json and core.py. The editable chart samples every 10 steps from full step-by-step recomputation. Both recommendation orders and vocabulary order start from the same ${evidence.known_count} known characters and use the same 450 words. After 100 additional characters: vocabulary order 40.0%, Default 58.2%, Read more 58.4%. This is an in-sample deterministic simulation with a curated subset and an objective related to the evaluation measure. It is not held-out evidence, real-text comprehension, or a user learning result. Automated results: 14 tests passed; browser interaction/responsive checks passed without page errors or failed requests; five real local-model calls produced supported evidence. Warm requests in that five-call run took about 3 seconds; first call 14 seconds. Learner testing and linguistic expert review remain pending. AI use: Codex assisted development/testing/deck; qwen2.5-coder:7b selects supported explanations locally.`);
  text(s6,'Same learner, same 450 words, 100 additional characters',64,142,1152,42,25,muted);
  const points=Array.from({length:11},(_,i)=>i*10);
  s6.charts.add('line',{position:{left:64,top:218,width:720,height:344},categories:points.map(String),
    series:Object.entries(evidence.curves).map(([name,values],i)=>({name:name==='My goal'?'Read more':name,values:points.map(p=>Number(values[p].toFixed(6))),fill:['#98A3AC','#147D78','#416FBE'][i]})),
    hasLegend:true,legend:{position:'bottom',textStyle:{fontFamily:'Arial',fontSize:17,color:muted}},
    xAxis:{title:'Additional characters learned',textStyle:{fontFamily:'Arial',fontSize:18,color:muted}},
    yAxis:{title:'Pilot words readable (%)',min:0,max:100,majorUnit:20,textStyle:{fontFamily:'Arial',fontSize:18,color:muted}},chartFill:paper,plotAreaFill:paper});
  text(s6,'14 automated tests passed',836,222,390,42,27,teal,true);
  text(s6,'5 local LLM checks passed\nKeyboard and responsive checks\nNo browser page errors',836,280,380,124,23,ink);
  text(s6,'Next',836,440,390,42,27,teal,true);
  text(s6,'Corpus frequency and richer data\nLearner task testing\nLanguage and usability review',836,494,380,122,23,ink);
  text(s6,'In-sample vocabulary simulation. Learning effectiveness and real-text comprehension remain untested.',64,607,720,48,20,muted);
  return {slides:presentation.slides.items.length};
}
