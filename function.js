
// ---- Simple dark toggle (body class) ----
const themeBtn = document.getElementById('themeBtn');
themeBtn?.addEventListener('click',()=>{
    document.documentElement.classList.toggle('light');
});

// ---- Projects data + render ----
const projects = [
    {id:"yt-moderation", title:"Inappropriate Content Detection for YouTube Streams", tags:["Deep Learning","Real-time","Computer Vision"], summary:"End-to-end system — data pipeline (5k+ clips), model training, and live inference with 20 ms/frame latency.", impact:[{label:"Precision",value:"90%"},{label:"Recall",value:"88%"},{label:"F1",value:"0.89"},{label:"Latency",value:"20 ms"}], links:[{href:"https://doi.org/10.10543/f0299.2023.41841",label:"Paper"}]},
    {id:"sign-transformer", title:"Sign Language Transformer using Spatial Representations", tags:["Transformer","NLP","CV"], summary:"Joint sign→gloss and gloss→text translation on PHOENIX‑2014T with spatial‑temporal encoders.", impact:[{label:"Dataset",value:"PHOENIX‑2014T"},{label:"Tasks",value:"S2G, G2T, S2G2T"}], links:[{href:"https://wseas.com/journals/ew/2024/a42engw-018(2024).pdf",label:"Paper"}]},
    {id:"siamese-face", title:"Siamese CNN Face Verification", tags:["Metric Learning","CNN","Contrastive Loss"], summary:"Twin‑network embeddings trained with contrastive loss; robust on <500 images with 92% verification accuracy.", impact:[{label:"Accuracy",value:"92%"},{label:"Data",value:"<500 imgs"}]},
    {id:"gas-iot", title:"$20 Gas Leak Detection & Alerting (IoT)", tags:["IoT","Embedded","ESP‑01"], summary:"555 Timer + ESP‑01 stack that emails alerts within ~5s of leak detection; Arduino‑based firmware.", impact:[{label:"Response",value:"<5s"},{label:"Cost",value:"<$20"}]}
];

const tagSet = new Set(["All"]); projects.forEach(p=>p.tags.forEach(t=>tagSet.add(t)));

const tagBar = document.getElementById('tagBar');
const grid = document.getElementById('projectsGrid');

function renderTags(active="All"){
    tagBar.innerHTML = "";
    [...tagSet].forEach(t=>{
    const btn = document.createElement('button');
    btn.className = 'btn';
    if(t===active) btn.style.background = 'rgba(255,255,255,.08)';
    btn.textContent = t; btn.onclick = ()=>{renderTags(t); renderProjects(t)};
    tagBar.appendChild(btn);
    });
}

function kpi(label,value){
    return `<div class="kpi"><span class="muted" style="font-size:14px">${label}</span><b>${value}</b></div>`
}

function renderProjects(activeTag="All"){
    grid.innerHTML = '';
    const list = activeTag==='All' ? projects : projects.filter(p=>p.tags.includes(activeTag));
    list.forEach(p=>{
    const item = document.createElement('article');
    item.className = 'card shadow reveal';
    item.innerHTML = `
        <h3 style="font-size:18px">${p.title}</h3>
        <p class="muted" style="margin-top:8px;font-size:14px">${p.summary}</p>
        <div class="row" style="margin-top:10px">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="grid two" style="margin-top:12px">${p.impact.map(i=>kpi(i.label,i.value)).join('')}</div>
        ${p.links? `<div class="row" style="margin-top:12px">${p.links.map(l=>`<a class="pill" href="${l.href}">↗ ${l.label}</a>`).join('')}</div>` : ''}
    `;
    grid.appendChild(item);
    });
}

renderTags();
renderProjects();