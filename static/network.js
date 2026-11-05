export default function(component) {
  const {parentElement, data, setTriggerValue} = component;
  const root = parentElement.querySelector('#network');
  root.replaceChildren();
  const d3 = globalThis.d3;
  const width = Math.max(root.clientWidth, 300), height = 390;
  const svg = d3.select(root).append('svg').attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'group').attr('aria-label', 'Character component network. Tab to a node and press Enter to select.');
  const nodes = data.nodes.map(n => ({...n}));
  const links = data.links.map(l => ({...l}));
  const colors = {Novice: '#147d78', A: '#416fbe', B: '#ad682e', C: '#86568a', Unknown: '#76828e'};
  const line = svg.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#bac7cc').attr('stroke-width', 1.5);
  const groups = svg.append('g').selectAll('g').data(nodes).join('g')
    .attr('class', 'character-node').attr('data-character', d => d.id)
    .attr('tabindex', 0).attr('role', 'button')
    .attr('aria-label', d => `Select ${d.id}${d.known ? ', known' : ''}${d.component ? ', component only' : ''}`)
    .style('cursor', 'pointer');
  groups.append('circle').attr('r', d => 20 + Math.sqrt(d.prevalence || 0) * 2.2)
    .attr('fill', d => d.component ? '#f4f5f3' : colors[d.band] || colors.Unknown)
    .attr('stroke', d => d.id === data.selected ? '#192f40' : d.recommended ? '#c66b38' : d.known ? '#192f40' : d.component ? '#76828e' : '#fff')
    .attr('stroke-width', d => d.id === data.selected ? 4 : d.recommended ? 4 : d.known ? 2 : 1)
    .attr('stroke-dasharray', d => d.component ? '4 3' : null)
    .attr('fill-opacity', d => data.heatEnabled ? 0.65 + 0.35 * (d.heat / (data.maxHeat || 1)) : 1);
  groups.append('text').text(d => d.id).attr('text-anchor', 'middle').attr('dy', '.35em')
    .attr('fill', d => d.component ? '#253d4d' : '#fff').style('font-size', '23px')
    .style('font-family', '"PingFang TC", "Microsoft JhengHei", sans-serif').style('pointer-events', 'none');
  groups.append('text').text(d => d.pinyin || (d.component ? 'component' : ''))
    .attr('text-anchor', 'middle').attr('dy', d => 35 + Math.sqrt(d.prevalence || 0) * 2.2)
    .attr('fill', '#536372').style('font-size', '12px').style('pointer-events', 'none');
  groups.append('title').text(d => `${d.id} · ${d.pinyin || 'Reading unavailable'}\n${d.prevalence || 0} vocabulary entries${d.known ? '\nKnown' : ''}`);
  const choose = (event, d) => {
    if (!d.component) setTriggerValue('selected', d.id);
    else root.querySelector('[role="status"]').textContent = `${d.id} is a structural component, outside the learning vocabulary.`;
  };
  groups.on('click', choose).on('keydown', (event, d) => {
    if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); choose(event, d);}
  });
  const simulation = d3.forceSimulation(nodes).randomSource(d3.randomLcg(0.42))
    .force('link', d3.forceLink(links).id(d => d.id).distance(90))
    .force('charge', d3.forceManyBody().strength(-440))
    .force('center', d3.forceCenter(width / 2, height / 2 - 12))
    .force('collision', d3.forceCollide(d => 39 + Math.sqrt(d.prevalence || 0) * 2.2));
  for (let i = 0; i < 130; i++) simulation.tick();
  simulation.on('tick', () => {
    nodes.forEach(d => {d.x = Math.max(40, Math.min(width - 40, d.x)); d.y = Math.max(36, Math.min(height - 52, d.y));});
    line.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    groups.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  groups.call(d3.drag().on('start', (event, d) => {simulation.alphaTarget(0.1).restart();d.fx=d.x;d.fy=d.y;})
    .on('drag', (event, d) => {d.fx=event.x;d.fy=event.y;})
    .on('end', (event, d) => {simulation.alphaTarget(0);d.fx=null;d.fy=null;}));
  const status = document.createElement('div'); status.setAttribute('role', 'status');
  status.style.fontSize='12px'; status.style.color='#536372'; status.style.minHeight='20px';root.append(status);
  return () => simulation.stop();
}
