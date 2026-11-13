import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Box, Cpu, Layers3, MoveRight, Ruler, Workflow } from 'lucide-react';

const projects = [
  {
    number: '01',
    category: 'Ag-tech hardware · Field instrumentation',
    title: 'Crowe Sense',
    subtitle: 'A sensor system designed around the realities of a working grow room.',
    body: 'A multi-zone cultivation telemetry system developed and deployed in a commercial production environment. The work connected physical sensor nodes, environmental measurements, and batch-level production outcomes into one operating picture.',
    design: ['Sensor placement across distinct grow zones', 'Field deployment and repeatable measurement', 'A practical path from environmental readings to operational decisions'],
    proof: '3,596,420 readings · 23 continuous days',
    note: 'Open-hardware sensor-node design and DOI-backed technical record.',
    href: 'https://doi.org/10.5281/zenodo.20722953',
    linkLabel: 'View technical record',
    kind: 'instrument',
  },
  {
    number: '02',
    category: 'Production systems · Physical workflow',
    title: 'The cultivation floor',
    subtitle: 'Designing the system around people, materials, space, and repeatability.',
    body: 'Founded and operated Southwest Mushrooms, a commercial cultivation operation. The work required translating biological processes into a physical production system: room layouts, environmental control, material movement, sanitation, equipment use, and repeatable work sequences.',
    design: ['Production flow from preparation through harvest', 'Equipment and room use under real operating constraints', 'Human factors, cleaning access, serviceability, and process clarity'],
    proof: 'Commercial operation · Phoenix, Arizona · 2017–2025',
    note: 'A real operating environment—not a speculative facility rendering.',
    href: 'https://www.southwestmushrooms.com',
    linkLabel: 'View operation archive',
    kind: 'workflow',
  },
  {
    number: '03',
    category: 'Human-machine interface · Control software',
    title: 'Crowe Logic Desktop',
    subtitle: 'Making complex machine capability understandable and controllable.',
    body: 'A desktop environment for working with AI engines and software agents. Its design problem is operational: make system state visible, keep actions reviewable, and put authorization between intent and execution.',
    design: ['Plan, read, edit, and execute as distinct interaction modes', 'Visible state, reviewable changes, and approval gates', 'A consistent control surface across multiple model providers'],
    proof: 'Published agent tooling · PyPI and npm',
    note: 'Software interface work; included to show systems thinking and interaction design.',
    href: 'https://github.com/MichaelCrowe11',
    linkLabel: 'Explore engineering work',
    kind: 'interface',
  },
];

function InstrumentDiagram() {
  return (
    <svg viewBox="0 0 720 420" role="img" aria-label="Illustrative diagram of a modular environmental sensor node and multi-zone telemetry system" className="w-full h-auto">
      <defs>
        <linearGradient id="node" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7e1d4"/><stop offset="1" stopColor="#a9a397"/></linearGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#b7ad9b" strokeOpacity=".16" strokeWidth="1"/></pattern>
      </defs>
      <rect width="720" height="420" fill="#11120f"/>
      <rect width="720" height="420" fill="url(#grid)"/>
      <path d="M0 330H720" stroke="#b7ad9b" strokeOpacity=".25"/>
      <g stroke="#c9a86b" strokeWidth="2" fill="none" strokeDasharray="5 7">
        <path d="M180 186C260 186 260 100 342 100"/>
        <path d="M180 186C260 186 260 210 342 210"/>
        <path d="M180 186C260 186 260 320 342 320"/>
      </g>
      <g>
        <rect x="66" y="128" width="114" height="116" rx="8" fill="url(#node)" stroke="#f2e8d6" strokeOpacity=".7"/>
        <rect x="82" y="144" width="82" height="50" rx="3" fill="#272a26"/>
        <circle cx="96" cy="160" r="4" fill="#c9a86b"/><circle cx="110" cy="160" r="4" fill="#8cb8a0"/>
        <path d="M92 178H153" stroke="#9da99b" strokeWidth="2"/>
        <rect x="92" y="208" width="62" height="18" rx="2" fill="#d4cfc2"/>
        <text x="123" y="274" fill="#ded7c8" textAnchor="middle" fontSize="11" letterSpacing="2">SENSOR NODE</text>
      </g>
      {[100,210,320].map((y,i)=><g key={y}>
        <rect x="342" y={y-27} width="146" height="54" rx="4" fill="#242722" stroke="#7d806e"/>
        <circle cx="365" cy={y} r="7" fill={i===1?'#c9a86b':'#8cb8a0'}/>
        <text x="385" y={y-3} fill="#e7e1d4" fontSize="12">ZONE 0{i+1}</text>
        <text x="385" y={y+13} fill="#a8a394" fontSize="9">ENVIRONMENTAL INPUT</text>
        <path d={`M488 ${y}H548`} stroke="#c9a86b" strokeWidth="1.5"/>
      </g>)}
      <rect x="548" y="143" width="112" height="86" rx="4" fill="#252922" stroke="#c9a86b" strokeOpacity=".7"/>
      <path d="M566 164H642M566 178H630M566 192H638" stroke="#a7b4a0" strokeWidth="2"/>
      <text x="604" y="248" textAnchor="middle" fill="#ded7c8" fontSize="10" letterSpacing="1.5">DATA / DECISIONS</text>
      <text x="66" y="382" fill="#a8a394" fontSize="10" letterSpacing="2">FIELD DEVICE</text>
      <text x="342" y="382" fill="#a8a394" fontSize="10" letterSpacing="2">DISTRIBUTED MEASUREMENT</text>
      <text x="548" y="382" fill="#a8a394" fontSize="10" letterSpacing="2">CONTROL LOOP</text>
    </svg>
  );
}

function WorkflowDiagram() {
  const stages = ['Prepare', 'Inoculate', 'Incubate', 'Fruit', 'Harvest'];
  return (
    <div className="w-full bg-[#11120f] border border-white/10 p-6 md:p-9">
      <div className="eyebrow-mono text-[#c9a86b] mb-8">Production sequence · conceptual process map</div>
      <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
        {stages.map((stage, i) => (
          <div key={stage} className="relative">
            <div className="aspect-square border border-[#b9a77d]/45 bg-[#1b1d18] flex items-center justify-center">
              <span className="font-display text-2xl md:text-4xl text-[#d8c8a4]">0{i+1}</span>
            </div>
            <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[.14em] text-[#e7e1d4]">{stage}</p>
            {i < stages.length-1 && <MoveRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-[#c9a86b]" size={18}/>}
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm leading-7 text-white/55">Each stage changes the requirements for space, equipment, environmental conditions, handling, and sanitation. Designing the complete sequence reduces friction at the handoffs.</p>
    </div>
  );
}

function InterfaceDiagram() {
  return (
    <div className="w-full bg-[#11120f] border border-white/10 p-5 md:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <span className="eyebrow-mono text-[#c9a86b]">CONTROL / SESSION 014</span>
        <span className="text-[10px] tracking-widest text-[#8cb8a0]">● SYSTEM READY</span>
      </div>
      <div className="grid grid-cols-[92px_1fr] md:grid-cols-[130px_1fr] gap-4 mt-5">
        <div className="space-y-2">
          {['PLAN','READ','EDIT','EXECUTE'].map((item,i)=><div key={item} className={`px-2 py-3 text-[9px] tracking-[.16em] border ${i===0?'border-[#c9a86b]/70 bg-[#c9a86b]/10 text-[#e5d1a5]':'border-white/10 text-white/35'}`}>{item}</div>)}
        </div>
        <div>
          <div className="text-xs text-white/75 mb-3">Proposed operation</div>
          <div className="border border-white/10 p-4 bg-black/20">
            <div className="flex gap-2 items-center text-[10px] text-white/45"><span className="w-2 h-2 rounded-full bg-[#c9a86b]"/> REVIEW REQUIRED</div>
            <div className="h-2 w-4/5 bg-white/15 mt-5"/><div className="h-2 w-3/5 bg-white/10 mt-2"/>
            <div className="mt-6 flex flex-wrap gap-2"><span className="border border-[#8cb8a0]/40 px-3 py-2 text-[9px] text-[#a7c3ad]">APPROVE</span><span className="border border-white/15 px-3 py-2 text-[9px] text-white/45">INSPECT DIFF</span><span className="border border-white/15 px-3 py-2 text-[9px] text-white/45">REJECT</span></div>
          </div>
          <p className="text-[10px] text-white/35 mt-3">Illustrative interface diagram · not a product screenshot</p>
        </div>
      </div>
    </div>
  );
}

export default function IndustrialDesignPage() {
  return (
    <main className="min-h-screen bg-[#090a08] text-[#ece8de]">
      <header className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(201,168,107,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(201,168,107,.08) 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-20 md:pt-16 md:pb-28">
          <Link href="/" className="inline-flex items-center gap-2 text-xs tracking-[.16em] uppercase text-white/45 hover:text-white transition-colors"><ArrowLeft size={14}/> Michael Crowe</Link>
          <div className="mt-16 md:mt-24 max-w-5xl">
            <p className="eyebrow-mono text-[#c9a86b]">Selected work / 2026</p>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-8xl leading-[.94] tracking-tight">Industrial design<br/><span className="text-[#c9a86b]">&amp; product systems.</span></h1>
            <p className="mt-8 max-w-2xl text-base md:text-lg leading-8 text-white/60">I design from the point where an object meets its environment and the person using it. My work spans field instrumentation, physical production systems, and the interfaces that make complex tools understandable.</p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[10px] uppercase tracking-[.18em] text-white/40"><span>Physical systems</span><span>Human factors</span><span>Hardware + software</span><span>Operational design</span></div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div><p className="eyebrow-mono text-[#c9a86b]">01 / Design approach</p><h2 className="font-display text-3xl md:text-5xl mt-3">Useful objects. Coherent systems.</h2></div>
          <span className="hidden md:block text-[10px] tracking-[.18em] text-white/35 uppercase">Observe → Design → Operate → Refine</span>
        </div>
        <div className="grid md:grid-cols-3 gap-8 border-t border-white/15 pt-7">
          <div><Ruler className="text-[#c9a86b]" size={20}/><h3 className="mt-4 font-display text-2xl">Form follows use</h3><p className="mt-2 text-sm leading-7 text-white/50">Start with the environment, the user, and the task. Let constraints shape the object—not the other way around.</p></div>
          <div><Workflow className="text-[#c9a86b]" size={20}/><h3 className="mt-4 font-display text-2xl">Design the whole loop</h3><p className="mt-2 text-sm leading-7 text-white/50">Consider setup, operation, maintenance, cleaning, repair, and end-of-life—not just the hero view.</p></div>
          <div><Layers3 className="text-[#c9a86b]" size={20}/><h3 className="mt-4 font-display text-2xl">Connect disciplines</h3><p className="mt-2 text-sm leading-7 text-white/50">Physical products, embedded sensing, software, and human decisions are parts of one experience.</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="mb-10"><p className="eyebrow-mono text-[#c9a86b]">02 / Selected projects</p><h2 className="font-display text-3xl md:text-5xl mt-3">Built in the real world.</h2></div>
        <div className="space-y-20 md:space-y-28">
          {projects.map((project) => (
            <article key={project.number} className="grid lg:grid-cols-[.8fr_1.2fr] gap-8 lg:gap-14 border-t border-white/15 pt-8">
              <div>
                <p className="eyebrow-mono text-[#c9a86b]">{project.number} / {project.category}</p>
                <h3 className="font-display text-4xl md:text-5xl mt-5 leading-[1.02]">{project.title}</h3>
                <p className="mt-5 text-lg text-white/75 leading-7">{project.subtitle}</p>
                <p className="mt-5 text-sm leading-7 text-white/50">{project.body}</p>
                <ul className="mt-6 space-y-3">{project.design.map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-white/65"><span className="text-[#c9a86b]">—</span>{item}</li>)}</ul>
                <div className="mt-8 pt-5 border-t border-white/10">
                  <p className="text-xs text-[#e0c994]">{project.proof}</p>
                  <p className="mt-2 text-xs text-white/35">{project.note}</p>
                  <a href={project.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-5 text-xs uppercase tracking-[.15em] text-white/65 hover:text-[#e0c994] transition-colors">{project.linkLabel}<ArrowUpRight size={14}/></a>
                </div>
              </div>
              <div className="self-start">
                {project.kind==='instrument' ? <InstrumentDiagram/> : project.kind==='workflow' ? <WorkflowDiagram/> : <InterfaceDiagram/>}
                <p className="mt-3 text-[10px] uppercase tracking-[.15em] text-white/30">{project.kind==='instrument'?'System schematic · illustrative, not a manufacturing drawing':project.kind==='workflow'?'Operational sequence · process map':'Interaction model · illustrative interface diagram'}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#11120f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div><p className="eyebrow-mono text-[#c9a86b]">03 / Collaboration</p><h2 className="font-display text-4xl md:text-6xl mt-4 max-w-3xl">Make the experience tangible.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/55">Interested in product design, physical-digital experiences, hardware interfaces, and systems that reward curiosity and play.</p></div>
          <a href="mailto:michael@crowelogic.com?subject=Industrial%20Design%20Portfolio" className="inline-flex items-center gap-3 border border-[#c9a86b]/60 px-6 py-4 text-xs uppercase tracking-[.16em] text-[#e0c994] hover:bg-[#c9a86b]/10 transition-colors">Contact Michael <ArrowUpRight size={16}/></a>
        </div>
      </section>
      <footer className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-wrap justify-between gap-4 text-[10px] uppercase tracking-[.16em] text-white/30"><span>Michael Crowe · Phoenix, Arizona</span><span>Industrial Design / Product Systems</span><Link href="/" className="hover:text-white/70">Return to main site</Link></footer>
    </main>
  );
}
