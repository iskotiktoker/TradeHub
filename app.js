// ========== CONSTANTS ==========
const STORAGE_KEY='tradehub_v3';
const RATES={KGS:1,RUB:1.05,USD:0.0115};
const SYMS={KGS:'с',RUB:'₽',USD:'$'};
const PAGES={dashboard:'Дашборд',products:'Товары',analytics:'Аналитика',vegetables:'Овощи / Фрукты',calculator:'Калькулятор',alerts:'Уведомления',settings:'Настройки'};

// ========== STATE ==========
let S={
  lang:'ru',currency:'KGS',user:null,
  productFilter:'all',productSort:{col:'name',dir:1},
  products:[
    {id:1,name:'iPhone 15 Pro',sku:'IP15P-256',cat:'Электроника',buy:75000,sell:95000,stock:12,sold:38,min:5},
    {id:2,name:'Samsung Galaxy S24',sku:'SGS24-BLK',cat:'Электроника',buy:55000,sell:72000,stock:4,sold:22,min:5},
    {id:3,name:'Nike Air Force 1',sku:'NAF1-42',cat:'Обувь',buy:6500,sell:9200,stock:18,sold:45,min:8},
    {id:4,name:'AirPods Pro 2',sku:'APP2-WHT',cat:'Электроника',buy:18000,sell:24500,stock:0,sold:61,min:3},
    {id:5,name:'Adidas Ultraboost',sku:'AUB-43',cat:'Обувь',buy:8000,sell:12000,stock:7,sold:29,min:4},
    {id:6,name:'iPad Air 5',sku:'IPAD-A5',cat:'Электроника',buy:42000,sell:55000,stock:3,sold:15,min:3},
    {id:7,name:"Levi's 501 Jeans",sku:'LEV-32',cat:'Одежда',buy:3500,sell:5500,stock:25,sold:73,min:10},
    {id:8,name:'Sony WH-1000XM5',sku:'SWH-BLK',cat:'Электроника',buy:28000,sell:37000,stock:9,sold:18,min:3},
  ],
  vegetables:[
    {id:101,name:'Помидор',cat:'🥔 Овощи',unit:'ящик',kgPerBox:20,boxes:15,buy:35,sell:60,soldKg:180,supplier:'Ош базар',arrival:'2026-05-10',shelf:7},
    {id:102,name:'Картошка',cat:'🥔 Овощи',unit:'мешок',kgPerBox:50,boxes:20,buy:18,sell:28,soldKg:350,supplier:'Алайский',arrival:'2026-05-08',shelf:30},
    {id:103,name:'Яблоко Симиренко',cat:'🍎 Фрукты',unit:'ящик',kgPerBox:18,boxes:10,buy:55,sell:90,soldKg:95,supplier:'Иссык-Куль',arrival:'2026-05-11',shelf:14},
    {id:104,name:'Огурец',cat:'🥔 Овощи',unit:'ящик',kgPerBox:15,boxes:8,buy:40,sell:65,soldKg:210,supplier:'Ош базар',arrival:'2026-05-09',shelf:5},
    {id:105,name:'Морковь',cat:'🥔 Овощи',unit:'мешок',kgPerBox:40,boxes:5,buy:22,sell:35,soldKg:120,supplier:'Чуй',arrival:'2026-05-07',shelf:21},
    {id:106,name:'Арбуз',cat:'🌽 Бахчевые',unit:'кг',kgPerBox:1,boxes:500,buy:12,sell:22,soldKg:680,supplier:'Жалал-Абад',arrival:'2026-05-12',shelf:10},
    {id:107,name:'Укроп',cat:'🌿 Зелень',unit:'коробка',kgPerBox:5,boxes:12,buy:80,sell:140,soldKg:30,supplier:'Местный',arrival:'2026-05-12',shelf:3},
    {id:108,name:'Лук репчатый',cat:'🧅 Лук/Чеснок',unit:'мешок',kgPerBox:50,boxes:18,buy:15,sell:25,soldKg:400,supplier:'Алайский',arrival:'2026-05-05',shelf:60},
    {id:109,name:'Малина',cat:'🍓 Ягоды',unit:'коробка',kgPerBox:5,boxes:12,buy:350,sell:600,soldKg:40,supplier:'Чуй',arrival:'2026-05-12',shelf:4},
    {id:110,name:'Вишня',cat:'🍓 Ягоды',unit:'ящик',kgPerBox:8,boxes:6,buy:180,sell:300,soldKg:20,supplier:'Иссык-Куль',arrival:'2026-05-10',shelf:5},
    {id:111,name:'Черешня',cat:'🍓 Ягоды',unit:'ящик',kgPerBox:10,boxes:8,buy:250,sell:450,soldKg:35,supplier:'Ош',arrival:'2026-05-11',shelf:6},
    {id:112,name:'Яблоко Голден',cat:'🍎 Фрукты',unit:'ящик',kgPerBox:18,boxes:5,buy:60,sell:100,soldKg:50,supplier:'Иссык-Куль',arrival:'2026-05-13',shelf:14},
  ],
  activity:[]
};

// ========== STORAGE ==========
function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return;
    const p=JSON.parse(raw);
    if(p.products&&Array.isArray(p.products))S.products=p.products;
    if(p.vegetables&&Array.isArray(p.vegetables))S.vegetables=p.vegetables;
    if(p.activity&&Array.isArray(p.activity))S.activity=p.activity;
    if(p.lang)S.lang=p.lang;
    if(p.currency)S.currency=p.currency;
  }catch(e){console.warn('State load failed',e);}
}
function saveState(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({products:S.products,vegetables:S.vegetables,activity:S.activity,lang:S.lang,currency:S.currency}));}
  catch(e){showToast('Ошибка сохранения','error');}
}

// ========== FORMAT ==========
function fmt(n){
  const v=Math.round(n*RATES[S.currency]);
  return SYMS[S.currency]+v.toLocaleString();
}
function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function genSku(){return 'SKU'+Math.random().toString(36).slice(-5).toUpperCase();}
function genId(){return Date.now()+Math.floor(Math.random()*1000);}
function todayISO(){return new Date().toISOString().split('T')[0];}

// ========== TOAST ==========
function showToast(msg,type='info'){
  const el=document.createElement('div');
  el.className='toast '+type;
  const icons={success:'✅',error:'❌',info:'ℹ️',warn:'⚠️'};
  el.innerHTML='<span class="toast-icon">'+icons[type]+'</span><span>'+esc(msg)+'</span>';
  document.getElementById('toastRoot').appendChild(el);
  setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),350);},3200);
}

// ========== AUTH ==========
function showError(msg){
  const el=document.getElementById('authError');
  el.textContent=msg;
  el.style.display='block';
}
function hideError(){document.getElementById('authError').style.display='none';}

function switchAuthTab(tab){
  hideError();
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.getElementById('loginForm').style.display=tab==='login'?'block':'none';
  document.getElementById('registerForm').style.display=tab==='register'?'block':'none';
  document.getElementById('twoFaPanel').style.display='none';
}

function togglePw(id,btn){
  const el=document.getElementById(id);
  const isText=el.type==='text';
  el.type=isText?'password':'text';
  btn.textContent=isText?'👁':'🙈';
}

function checkStrength(pw){
  const tests=[/.{8,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/];
  const score=tests.filter(r=>r.test(pw)).length;
  const fill=document.getElementById('strengthFill');
  const label=document.getElementById('strengthLabel');
  const data=[
    {w:'0%',c:'transparent',l:''},
    {w:'25%',c:'var(--red)',l:'Слабый'},
    {w:'50%',c:'var(--amber)',l:'Средний'},
    {w:'75%',c:'var(--blue)',l:'Хороший'},
    {w:'100%',c:'var(--green)',l:'Отличный'},
  ];
  const d=data[score]||data[0];
  fill.style.width=d.w;
  fill.style.background=d.c;
  label.textContent=d.l;
  label.style.color=d.c;
}

function doLogin(){
  hideError();
  const email=(document.getElementById('loginEmail').value||'').trim().toLowerCase();
  const pass=document.getElementById('loginPass').value;
  if(!email||!pass){showError('Заполните все поля');return;}
  if(email==='admin@trade.com'&&pass==='admin123'){
    document.getElementById('loginForm').style.display='none';
    document.getElementById('twoFaPanel').style.display='block';
    setTimeout(()=>{const inputs=document.querySelectorAll('.otp-input');if(inputs[0])inputs[0].focus();},100);
  }else{
    showError('Неверный email или пароль');
    document.getElementById('loginPass').value='';
  }
}

function backToLogin(){
  document.getElementById('loginForm').style.display='block';
  document.getElementById('twoFaPanel').style.display='none';
  document.querySelectorAll('.otp-input').forEach(i=>i.value='');
  hideError();
}

function verify2FA(){
  const code=Array.from(document.querySelectorAll('.otp-input')).map(i=>i.value).join('');
  if(code.length<6){showToast('Введите 6-значный код','error');return;}
  enterApp({name:'Admin',email:'admin@trade.com',initials:'АД'});
}

function doRegister(){
  hideError();
  const name=(document.getElementById('regName').value||'').trim();
  const email=(document.getElementById('regEmail').value||'').trim();
  const pass=document.getElementById('regPass').value;
  if(!name||!email||!pass){showError('Заполните все поля');return;}
  if(pass.length<6){showError('Пароль минимум 6 символов');return;}
  enterApp({name,email,initials:name.slice(0,2).toUpperCase()});
}

function enterApp(user){
  S.user=user;
  document.getElementById('authScreen').style.display='none';
  document.getElementById('app').style.display='block';
  renderAll();
  showToast('Добро пожаловать, '+user.name+'!','success');
}

function doLogout(){
  if(!confirm('Выйти из аккаунта?'))return;
  S.user=null;
  document.getElementById('authScreen').style.display='flex';
  document.getElementById('app').style.display='none';
  document.getElementById('loginForm').style.display='block';
  document.getElementById('twoFaPanel').style.display='none';
  document.getElementById('loginEmail').value='';
  document.getElementById('loginPass').value='';
  document.querySelectorAll('.otp-input').forEach(i=>i.value='');
  hideError();
}

// ========== SIDEBAR / NAV ==========
function toggleSidebar(){
  const sb=document.getElementById('sidebar');
  const bd=document.getElementById('sidebarBackdrop');
  const open=sb.classList.toggle('open');
  bd.classList.toggle('show',open);
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
}

let _currentPage='dashboard';
function navTo(name,navEl){
  closeSidebar();
  if(_currentPage===name&&navEl)return;
  _currentPage=name;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg)pg.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(navEl)navEl.classList.add('active');
  else{const ni=document.querySelector('.nav-item[data-page="'+name+'"]');if(ni)ni.classList.add('active');}
  const titleEl=document.getElementById('topbarTitle');
  if(titleEl)titleEl.textContent=PAGES[name]||name;
  if(name==='products')renderProducts();
  if(name==='vegetables')renderVegetables();
  if(name==='dashboard'){renderDashboard();}
  if(name==='analytics')renderAnalytics();
  if(name==='alerts')renderAllAlerts();
}

// ========== DEBOUNCE ==========
function debounce(fn,ms=250){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}
const debouncedRenderProducts=debounce(renderProducts,200);
const debouncedRenderVeg=debounce(renderVegetables,200);

// ========== DASHBOARD ==========
function renderDashboard(){renderDashStats();renderSalesChart();renderCategoryDonut();renderDashAlerts();}

function renderDashStats(){
  const rev=S.products.reduce((s,p)=>s+p.sell*p.sold,0);
  const cost=S.products.reduce((s,p)=>s+p.buy*p.sold,0);
  const sold=S.products.reduce((s,p)=>s+p.sold,0);
  const low=S.products.filter(p=>p.stock>0&&p.stock<=p.min).length;
  const out=S.products.filter(p=>p.stock===0).length;
  const el=document.getElementById('dashStats');
  if(!el)return;
  el.innerHTML=`
    <div class="stat-card green"><div class="stat-glow"></div><div class="stat-label">Выручка</div><div class="stat-value">${fmt(rev)}</div><div class="stat-change up">▲ 12.4% к прошлой неделе</div><div class="stat-icon">💰</div></div>
    <div class="stat-card blue"><div class="stat-glow"></div><div class="stat-label">Прибыль</div><div class="stat-value">${fmt(rev-cost)}</div><div class="stat-change up">▲ 8.1%</div><div class="stat-icon">📈</div></div>
    <div class="stat-card amber"><div class="stat-glow"></div><div class="stat-label">Продано единиц</div><div class="stat-value">${sold.toLocaleString()}</div><div class="stat-change neutral">За всё время</div><div class="stat-icon">🛒</div></div>
    <div class="stat-card red"><div class="stat-glow"></div><div class="stat-label">Критических позиций</div><div class="stat-value">${low+out}</div><div class="stat-change down">▼ Требует пополнения</div><div class="stat-icon">⚠️</div></div>
  `;
  const badge=document.getElementById('navLowBadge');
  const cnt=low+out;
  if(badge){badge.textContent=cnt;badge.style.display=cnt?'':'none';}
  const notifDot=document.getElementById('notifDot');
  const alertBadge=document.getElementById('navAlertBadge');
  const alertCnt=buildAlerts().length;
  if(notifDot)notifDot.style.display=alertCnt?'':'none';
  if(alertBadge){alertBadge.textContent=alertCnt;alertBadge.style.display=alertCnt?'':'none';}
}

function renderSalesChart(){
  const el=document.getElementById('salesBars');
  if(!el)return;
  const days=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const vals=[42,78,55,91,63,110,88];
  const max=Math.max(...vals);
  el.innerHTML=vals.map((v,i)=>`
    <div class="bar-col">
      <div class="bar-block" style="height:${Math.round(v/max*100)}%;background:linear-gradient(180deg,var(--accent),var(--accent2));opacity:${.5+v/max*.5};" title="${days[i]}: ${v} шт"></div>
      <div class="bar-lbl">${days[i]}</div>
    </div>
  `).join('');
}

function renderCategoryDonut(){
  const el=document.getElementById('categoryDonut');
  if(!el)return;
  const cats={};
  S.products.forEach(p=>{cats[p.cat]=(cats[p.cat]||0)+p.sell*p.sold;});
  const total=Object.values(cats).reduce((s,v)=>s+v,0)||1;
  const palette=['var(--accent)','var(--green)','var(--amber)','var(--blue)','var(--pink)'];
  const entries=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const r=38,cx=45,cy=45,circ=2*Math.PI*r;
  let offset=0;
  const arcs=entries.map((([cat,val],i)=>{
    const pct=val/total;
    const dash=pct*circ;
    const arc=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${palette[i%palette.length]}" stroke-width="9" stroke-dasharray="${dash.toFixed(2)} ${(circ-dash).toFixed(2)}" stroke-dashoffset="${(-offset*circ).toFixed(2)}" stroke-linecap="round"/>`;
    offset+=pct;
    return{arc,cat,pct,color:palette[i%palette.length]};
  }));
  const topCat=entries[0]||['—',0];
  el.innerHTML=`
    <div class="donut-svg-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="none" stroke="var(--bg3)" stroke-width="9"/>${arcs.map(a=>a.arc).join('')}</svg>
      <div class="donut-center"><div class="donut-pct">${Math.round((topCat[1]||0)/total*100)}%</div><div class="donut-lbl">${(topCat[0]||'').slice(0,8)}</div></div>
    </div>
    <div class="legend">${arcs.map(a=>`<div class="leg-item"><div class="leg-dot" style="background:${a.color}"></div><span>${esc(a.cat)}</span><span class="leg-val">${Math.round(a.pct*100)}%</span></div>`).join('')}</div>
  `;
}

function buildAlerts(){
  const alerts=[];
  const today=new Date();
  S.products.forEach(p=>{
    if(p.stock===0)alerts.push({type:'danger',icon:'🔴',text:`<strong>${esc(p.name)}</strong> — закончился на складе!`,time:'Склад'});
    else if(p.stock<=p.min)alerts.push({type:'warn',icon:'📦',text:`<strong>${esc(p.name)}</strong> — остаток ${p.stock} шт (мин: ${p.min})`,time:'Склад'});
  });
  S.vegetables.forEach(v=>{
    if(v.shelf>=999)return;
    const exp=new Date(v.arrival);exp.setDate(exp.getDate()+v.shelf);
    const days=Math.ceil((exp-today)/864e5);
    if(days<=0)alerts.push({type:'danger',icon:'🍅',text:`<strong>${esc(v.name)}</strong> — срок годности ИСТЁК`,time:'Склад'});
    else if(days<=3)alerts.push({type:'warn',icon:'⏰',text:`<strong>${esc(v.name)}</strong> — истекает через ${days} дн.`,time:'Склад'});
  });
  return alerts;
}

function renderDashAlerts(){
  const el=document.getElementById('dashAlertsList');
  if(!el)return;
  const alerts=buildAlerts().slice(0,6);
  if(!alerts.length){el.innerHTML='<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-title">Всё в порядке</div><div class="empty-sub">Нет активных предупреждений</div></div>';return;}
  el.innerHTML=alerts.map(a=>`<div class="alert-item ${a.type}"><span class="alert-icon">${a.icon}</span><div class="alert-text">${a.text}</div><div class="alert-time">${a.time}</div></div>`).join('');
}

function renderAllAlerts(){
  const el=document.getElementById('allAlertsList');
  if(!el)return;
  const alerts=buildAlerts();
  if(!alerts.length){el.innerHTML='<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-title">Нет уведомлений</div><div class="empty-sub">Все товары в норме</div></div>';return;}
  el.innerHTML=alerts.map(a=>`<div class="alert-item ${a.type}"><span class="alert-icon">${a.icon}</span><div class="alert-text">${a.text}</div><div class="alert-time">${a.time}</div></div>`).join('');
}

// ========== PRODUCTS CRUD ==========
let _editProductId=null;

function renderProducts(){
  const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();
  let prods=[...S.products];
  if(q)prods=prods.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));
  if(S.productFilter==='low')prods=prods.filter(p=>p.stock>0&&p.stock<=p.min);
  else if(S.productFilter==='out')prods=prods.filter(p=>p.stock===0);
  else if(S.productFilter==='good')prods=prods.filter(p=>p.stock>p.min);
  const{col,dir}=S.productSort;
  prods.sort((a,b)=>{
    const getVal=p=>({name:p.name.toLowerCase(),buy:p.buy,sell:p.sell,margin:(p.sell-p.buy)/Math.max(p.sell,1),sold:p.sold,stock:p.stock,status:p.stock===0?0:p.stock<=p.min?1:2}[col]??p.name);
    const va=getVal(a),vb=getVal(b);
    return va<vb?-dir:va>vb?dir:0;
  });
  document.querySelectorAll('#productsTable thead th').forEach(th=>{
    th.classList.remove('sort-asc','sort-desc');
    if(th.dataset.sort===col)th.classList.add(dir===1?'sort-asc':'sort-desc');
  });
  const body=document.getElementById('productsBody');
  if(!body)return;
  if(!prods.length){body.innerHTML=`<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">Ничего не найдено</div><div class="empty-sub">Попробуйте изменить фильтр или поиск</div></div></td></tr>`;return;}
  body.innerHTML=prods.map(p=>{
    const margin=p.sell?Math.round((p.sell-p.buy)/p.sell*100):0;
    const sc=p.stock===0?'badge-red':p.stock<=p.min?'badge-amber':'badge-green';
    const st=p.stock===0?'Нет':p.stock<=p.min?'Мало':'В наличии';
    return `<tr onclick="editProduct(${p.id})">
      <td><div class="prod-name">${esc(p.name)}</div><div class="prod-sku">${esc(p.sku)}</div></td>
      <td>${fmt(p.buy)}</td><td>${fmt(p.sell)}</td>
      <td><span class="${margin>=20?'profit-pos':'profit-neg'}">${margin}%</span></td>
      <td>${p.sold.toLocaleString()}</td><td>${p.stock}</td>
      <td><span class="badge ${sc}">${st}</span></td>
      <td><div class="actions-cell">
        <button class="action-btn edit" onclick="event.stopPropagation();editProduct(${p.id})" title="Редактировать">✏️</button>
        <button class="action-btn del" onclick="event.stopPropagation();deleteProduct(${p.id})" title="Удалить">🗑</button>
      </div></td>
    </tr>`;
  }).join('');
}

function setFilter(f,btn){
  S.productFilter=f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function openProductModal(editId=null){
  _editProductId=editId;
  const title=document.getElementById('productModalTitle');
  const modal=document.getElementById('productModal');
  document.getElementById('productModalCalc').style.display='none';
  if(editId){
    const p=S.products.find(x=>x.id===editId);
    if(!p)return;
    title.textContent='Редактировать товар';
    document.getElementById('mName').value=p.name;
    document.getElementById('mSku').value=p.sku;
    document.getElementById('mCat').value=p.cat;
    document.getElementById('mBuy').value=p.buy;
    document.getElementById('mSell').value=p.sell;
    document.getElementById('mStock').value=p.stock;
    document.getElementById('mMin').value=p.min;
    calcProductModal();
  }else{
    title.textContent='Добавить товар';
    ['mName','mSku','mBuy','mSell','mStock'].forEach(id=>{document.getElementById(id).value='';});
    document.getElementById('mMin').value='5';
    document.getElementById('mCat').value='Электроника';
  }
  modal.classList.add('open');
  setTimeout(()=>document.getElementById('mName').focus(),100);
}
function editProduct(id){openProductModal(id);}

function closeProductModal(){
  document.getElementById('productModal').classList.remove('open');
  _editProductId=null;
}

function calcProductModal(){
  const buy=+document.getElementById('mBuy').value||0;
  const sell=+document.getElementById('mSell').value||0;
  const calc=document.getElementById('productModalCalc');
  if(buy&&sell){
    calc.style.display='block';
    document.getElementById('pmMargin').textContent=Math.round((sell-buy)/sell*100)+'%';
    document.getElementById('pmProfit').textContent=fmt(sell-buy);
  }else{calc.style.display='none';}
}

function saveProduct(){
  const name=(document.getElementById('mName').value||'').trim();
  const buy=+document.getElementById('mBuy').value||0;
  const sell=+document.getElementById('mSell').value||0;
  const stock=+document.getElementById('mStock').value||0;
  const min=+document.getElementById('mMin').value||5;
  const sku=(document.getElementById('mSku').value||'').trim()||genSku();
  const cat=document.getElementById('mCat').value;
  if(!name){showToast('Введите название товара','error');return;}
  if(!sell){showToast('Введите цену продажи','error');return;}
  if(_editProductId){
    const idx=S.products.findIndex(p=>p.id===_editProductId);
    if(idx!==-1){S.products[idx]={...S.products[idx],name,sku,cat,buy,sell,stock,min};}
    addActivity(`Обновлён товар: ${name}`);
    showToast('Товар обновлён','success');
  }else{
    S.products.unshift({id:genId(),name,sku,cat,buy,sell,stock,sold:0,min});
    addActivity(`Добавлен товар: ${name}`);
    showToast('Товар добавлен','success');
  }
  closeProductModal();
  saveState();
  renderProducts();
  renderDashStats();
}

function deleteProduct(id){
  const p=S.products.find(x=>x.id===id);
  if(!p)return;
  if(!confirm('Удалить «'+p.name+'»? Это действие необратимо.'))return;
  S.products=S.products.filter(x=>x.id!==id);
  addActivity('Удалён товар: '+p.name);
  saveState();
  renderProducts();
  renderDashStats();
  showToast('Товар удалён','warn');
}

// ========== ANALYTICS ==========
function renderAnalytics(){
  const rev=S.products.reduce((s,p)=>s+p.sell*p.sold,0);
  const cost=S.products.reduce((s,p)=>s+p.buy*p.sold,0);
  const profit=rev-cost;
  const margins=S.products.filter(p=>p.sell).map(p=>(p.sell-p.buy)/p.sell*100);
  const avgMargin=margins.length?margins.reduce((s,v)=>s+v,0)/margins.length:0;
  const roi=cost?profit/cost*100:0;
  const sold=S.products.reduce((s,p)=>s+p.sold,0);
  const el=document.getElementById('analyticsCards');
  if(el)el.innerHTML=`
    <div class="stat-card green"><div class="stat-glow"></div><div class="stat-label">ROI</div><div class="stat-value">${roi.toFixed(1)}%</div><div class="stat-icon">📊</div></div>
    <div class="stat-card blue"><div class="stat-glow"></div><div class="stat-label">Средняя маржа</div><div class="stat-value">${avgMargin.toFixed(1)}%</div><div class="stat-icon">💹</div></div>
    <div class="stat-card amber"><div class="stat-glow"></div><div class="stat-label">Всего продано</div><div class="stat-value">${sold.toLocaleString()}</div><div class="stat-icon">🛒</div></div>
  `;
  const topEl=document.getElementById('topProfitList');
  if(topEl){
    const sorted=[...S.products].sort((a,b)=>(b.sell-b.buy)*b.sold-(a.sell-a.buy)*a.sold).slice(0,6);
    topEl.innerHTML=sorted.length?sorted.map((p,i)=>`
      <div class="top-item">
        <div class="top-rank">#${i+1}</div>
        <div class="top-name">${esc(p.name)}</div>
        <div class="top-val">${fmt((p.sell-p.buy)*p.sold)}</div>
      </div>`).join(''):'<div class="empty-state" style="padding:1rem;"><div class="empty-sub">Нет данных</div></div>';
  }
  const actEl=document.getElementById('activityFeed');
  if(actEl){
    const acts=[...S.activity].reverse().slice(0,8);
    actEl.innerHTML=acts.length?acts.map(a=>`<div class="activity-item"><div class="activity-dot" style="background:var(--accent)"></div><div class="activity-text">${esc(a.text)}</div><div class="activity-time">${a.time}</div></div>`).join(''):'<div class="empty-state" style="padding:1rem;"><div class="empty-sub">Нет действий</div></div>';
  }
  const riskEl=document.getElementById('riskGrid');
  if(riskEl){
    const outOfStock=S.products.filter(p=>p.stock===0);
    const lowStock=S.products.filter(p=>p.stock>0&&p.stock<=p.min);
    riskEl.innerHTML=`
      <div class="chart-card" style="background:var(--bg2);border-color:var(--red-dim);">
        <div class="chart-title" style="color:var(--red);font-size:.82rem;">❌ Нет в наличии (${outOfStock.length})</div>
        ${outOfStock.length?outOfStock.map(p=>`<div style="font-size:.8rem;padding:.2rem 0;color:var(--text2);">${esc(p.name)}</div>`).join(''):'<div style="font-size:.8rem;color:var(--text3);">Всё в наличии ✅</div>'}
      </div>
      <div class="chart-card" style="background:var(--bg2);border-color:var(--amber-dim);">
        <div class="chart-title" style="color:var(--amber);font-size:.82rem;">⚠️ Мало на складе (${lowStock.length})</div>
        ${lowStock.length?lowStock.map(p=>`<div style="font-size:.8rem;padding:.2rem 0;color:var(--text2);">${esc(p.name)} — ${p.stock} шт</div>`).join(''):'<div style="font-size:.8rem;color:var(--text3);">Склад в норме ✅</div>'}
      </div>
    `;
  }
}

function addActivity(text){
  S.activity.push({text,time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})});
  if(S.activity.length>50)S.activity=S.activity.slice(-50);
}

// ========== CALCULATOR ==========
function recalc(){
  const buy=+document.getElementById('calcBuy')?.value||0;
  const sell=+document.getElementById('calcSell')?.value||0;
  const extra=+document.getElementById('calcExtra')?.value||0;
  const qty=Math.max(1,+document.getElementById('calcQty')?.value||1);
  const res=document.getElementById('calcResult');
  if(!res)return;
  if(!buy&&!sell){res.style.display='none';return;}
  res.style.display='block';
  const revenue=sell*qty;
  const totalCost=(buy+extra)*qty;
  const profit=revenue-totalCost;
  const margin=revenue?profit/revenue*100:0;
  const roi=totalCost?profit/totalCost*100:0;
  document.getElementById('cRevenue').textContent=fmt(revenue);
  document.getElementById('cCost').textContent=fmt(buy*qty);
  document.getElementById('cExtra').textContent=fmt(extra*qty);
  document.getElementById('cProfit').textContent=fmt(profit);
  document.getElementById('cProfit').style.color=profit>=0?'var(--green)':'var(--red)';
  document.getElementById('cMargin').textContent=margin.toFixed(1)+'%';
  document.getElementById('cROI').textContent=roi.toFixed(1)+'%';
}

// ========== VEGETABLES CRUD ==========
let _editVegId=null;

function renderVegetables(){
  const q=(document.getElementById('vegSearch')?.value||'').toLowerCase().trim();
  const vegs=S.vegetables.filter(v=>!q||v.name.toLowerCase().includes(q)||v.cat.toLowerCase().includes(q)||(v.supplier||'').toLowerCase().includes(q));
  const today=new Date();
  let totalKg=0,totalBoxes=0,totalSoldKg=0;
  S.vegetables.forEach(v=>{
    // только ящики и кг/ящик — без умножения друг на друга в итоговом весе
    totalKg+=v.kgPerBox+v.boxes;
    totalBoxes+=v.boxes;
    totalSoldKg+=v.soldKg||0;
  });
  const vegStatsEl=document.getElementById('vegStats');
  if(vegStatsEl)vegStatsEl.innerHTML=`
    <div class="stat-card green"><div class="stat-glow"></div><div class="stat-label">Общий вес на складе</div><div class="stat-value">${Math.round(totalKg)} кг</div><div class="stat-icon">⚖️</div></div>
    <div class="stat-card blue"><div class="stat-glow"></div><div class="stat-label">Ящиков / Мешков</div><div class="stat-value">${Math.round(totalBoxes)}</div><div class="stat-icon">📦</div></div>
    <div class="stat-card amber"><div class="stat-glow"></div><div class="stat-label">Продано (кг)</div><div class="stat-value">${Math.round(totalSoldKg)} кг</div><div class="stat-icon">🛒</div></div>
    <div class="stat-card red"><div class="stat-glow"></div><div class="stat-label">Истекает срок</div><div class="stat-value" id="vegExpiring">0</div><div class="stat-icon">⏰</div></div>
  `;
  const body=document.getElementById('vegBody');
  if(!body)return;
  if(!vegs.length){body.innerHTML=`<tr><td colspan="13"><div class="empty-state"><div class="empty-icon">🥬</div><div class="empty-title">Нет товаров</div><div class="empty-sub">Добавьте первый товар</div></div></td></tr>`;return;}
  let expCount=0;
  body.innerHTML=vegs.map(v=>{
    const margin=v.sell?Math.round((v.sell-v.buy)/v.sell*100):0;
    // В таблице показываем ящики и кг/ящик отдельно, без перемножения
    let daysLeft=999,expiryColor='var(--green)',expiryText='—',statusClass='badge-green',statusText='Свежий';
    if(v.shelf<999){
      const exp=new Date(v.arrival);exp.setDate(exp.getDate()+v.shelf);
      daysLeft=Math.ceil((exp-today)/864e5);
      expiryText=daysLeft+' дн';
      if(daysLeft<=0){statusClass='badge-red';statusText='Просрочен';expiryColor='var(--red)';expiryText='ИСТЁК';expCount++;}
      else if(daysLeft<=3){statusClass='badge-red';statusText='Срочно!';expiryColor='var(--red)';expCount++;}
      else if(daysLeft<=7){statusClass='badge-amber';statusText='Скоро';expiryColor='var(--amber)';}
    }
    return `<tr onclick="editVeg(${v.id})">
      <td><div class="prod-name">${esc(v.name)}</div><div class="prod-sku">${esc(v.supplier||'')}</div></td>
      <td>${esc(v.cat)}</td><td>${esc(v.unit)}</td>
      <td>${v.kgPerBox} кг</td><td>${v.boxes}</td><td>${v.kgPerBox} кг</td>
      <td>${fmt(v.buy)}</td><td>${fmt(v.sell)}</td>
      <td><span class="${margin>=20?'profit-pos':'profit-neg'}">${margin}%</span></td>
      <td>${v.arrival.split('-').reverse().join('.')}</td>
      <td style="color:${expiryColor};font-weight:500;">${expiryText}</td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
      <td><div class="actions-cell">
        <button class="action-btn edit" onclick="event.stopPropagation();editVeg(${v.id})" title="Ред.">✏️</button>
        <button class="action-btn del" onclick="event.stopPropagation();deleteVeg(${v.id})" title="Удалить">🗑</button>
      </div></td>
    </tr>`;
  }).join('');
  const expEl=document.getElementById('vegExpiring');
  if(expEl)expEl.textContent=expCount;
  const sel=document.getElementById('vegCalcSelect');
  if(sel){
    sel.innerHTML=S.vegetables.map(v=>`<option value="${v.id}">${esc(v.name)}</option>`).join('');
    calcVeg();
  }
  renderVegExpiry(today);
}

function renderVegExpiry(today){
  const el=document.getElementById('vegExpiryList');
  if(!el)return;
  const list=S.vegetables.filter(v=>v.shelf<999).map(v=>{
    const exp=new Date(v.arrival);exp.setDate(exp.getDate()+v.shelf);
    return{...v,days:Math.ceil((exp-today)/864e5)};
  }).sort((a,b)=>a.days-b.days).slice(0,8);
  if(!list.length){el.innerHTML='<div class="empty-state" style="padding:1rem;"><div class="empty-sub">Нет данных о сроках</div></div>';return;}
  el.innerHTML=list.map(v=>{
    const color=v.days<=0?'var(--red)':v.days<=3?'var(--red)':v.days<=7?'var(--amber)':'var(--green)';
    return `<div class="expiry-item"><div class="expiry-name">${esc(v.name)}</div><div class="expiry-days" style="color:${color}">${v.days<=0?'ИСТЁК':v.days+' дн'}</div></div>`;
  }).join('');
}

function applyBoxType(){
  const val=document.getElementById('vmBoxType').value;
  if(val)document.getElementById('vmKgBox').value=val;
  calcVegModal();
}

function openVegModal(editId=null){
  _editVegId=editId;
  document.getElementById('vegModalTitle').textContent=editId?'✏️ Редактировать':'🥦 Добавить товар';
  document.getElementById('vmCalcResult').style.display='none';
  if(editId){
    const v=S.vegetables.find(x=>x.id===editId);
    if(!v)return;
    document.getElementById('vmName').value=v.name;
    document.getElementById('vmCat').value=v.cat;
    document.getElementById('vmUnit').value=v.unit;
    document.getElementById('vmKgBox').value=v.kgPerBox;
    document.getElementById('vmBoxes').value=v.boxes;
    document.getElementById('vmBuy').value=v.buy;
    document.getElementById('vmSell').value=v.sell;
    document.getElementById('vmArrival').value=v.arrival;
    document.getElementById('vmShelf').value=v.shelf>=999?'':v.shelf;
    document.getElementById('vmSupplier').value=v.supplier||'';
    document.getElementById('vmBoxType').value='';
    calcVegModal();
  }else{
    ['vmName','vmKgBox','vmBoxes','vmBuy','vmSell','vmShelf','vmSupplier'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('vmBoxType').value='';
    document.getElementById('vmArrival').value=todayISO();
    document.getElementById('vmCat').value='🥔 Овощи';
    document.getElementById('vmUnit').value='ящик';
  }
  document.getElementById('vegModal').classList.add('open');
  setTimeout(()=>document.getElementById('vmName').focus(),100);
}
function editVeg(id){openVegModal(id);}

function closeVegModal(){
  document.getElementById('vegModal').classList.remove('open');
  _editVegId=null;
}

function calcVegModal(){
  const kg=+document.getElementById('vmKgBox').value||0;
  const boxes=+document.getElementById('vmBoxes').value||0;
  const buy=+document.getElementById('vmBuy').value||0;
  const sell=+document.getElementById('vmSell').value||0;
  const res=document.getElementById('vmCalcResult');
  // Показываем данные БЕЗ умножения ящиков на кг/ящик
  if(kg||boxes){
    res.style.display='block';
    document.getElementById('vmTotalKg').textContent=kg+' кг/ящ, '+boxes+' ящ';
    document.getElementById('vmTotalCost').textContent=fmt(boxes*buy);
    document.getElementById('vmMarginVal').textContent=sell?Math.round((sell-buy)/sell*100)+'%':'—';
  }else{res.style.display='none';}
}

function saveVegetable(){
  const name=(document.getElementById('vmName').value||'').trim();
  if(!name){showToast('Введите название','error');return;}
  const shelfVal=document.getElementById('vmShelf').value;
  const data={
    name,
    cat:document.getElementById('vmCat').value,
    unit:document.getElementById('vmUnit').value,
    kgPerBox:+document.getElementById('vmKgBox').value||1,
    boxes:+document.getElementById('vmBoxes').value||0,
    buy:+document.getElementById('vmBuy').value||0,
    sell:+document.getElementById('vmSell').value||0,
    shelf:shelfVal?+shelfVal:999,
    supplier:(document.getElementById('vmSupplier').value||'').trim()||'—',
    arrival:document.getElementById('vmArrival').value||todayISO(),
  };
  if(_editVegId){
    const idx=S.vegetables.findIndex(v=>v.id===_editVegId);
    if(idx!==-1)S.vegetables[idx]={...S.vegetables[idx],...data};
    addActivity('Обновлён: '+name);
    showToast('Обновлено','success');
  }else{
    S.vegetables.unshift({id:genId(),...data,soldKg:0});
    addActivity('Добавлено: '+name);
    showToast('Добавлено','success');
  }
  closeVegModal();
  saveState();
  renderVegetables();
}

function deleteVeg(id){
  const v=S.vegetables.find(x=>x.id===id);
  if(!v)return;
  if(!confirm('Удалить «'+v.name+'»?'))return;
  S.vegetables=S.vegetables.filter(x=>x.id!==id);
  addActivity('Удалено: '+v.name);
  saveState();
  renderVegetables();
  showToast('Удалено','warn');
}

function calcVeg(){
  const id=+document.getElementById('vegCalcSelect')?.value;
  const v=S.vegetables.find(x=>x.id===id);
  if(!v)return;
  const boxes=+document.getElementById('vegCalcBoxes')?.value||0;
  const extraKg=+document.getElementById('vegCalcKg')?.value||0;
  // Показываем ящики и кг отдельно, без умножения
  const cost=boxes*v.buy+extraKg*v.buy;
  const rev=boxes*v.sell+extraKg*v.sell;
  const profit=rev-cost;
  document.getElementById('vcKg').textContent=boxes+' ящ + '+extraKg+' кг';
  document.getElementById('vcCost').textContent=fmt(cost);
  document.getElementById('vcRev').textContent=fmt(rev);
  document.getElementById('vcProfit').textContent=fmt(profit);
  document.getElementById('vcProfit').style.color=profit>=0?'var(--green)':'var(--red)';
  document.getElementById('vcMargin').textContent=rev?Math.round(profit/rev*100)+'%':'—';
}

// ========== SETTINGS ==========
function switchSettings(panel,btn){
  ['profile','security','preferences','data'].forEach(id=>{
    const el=document.getElementById('settings-'+id);
    if(el)el.style.display=id===panel?'block':'none';
  });
  document.querySelectorAll('.settings-nav-item').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
}

function saveProfile(){
  const name=(document.getElementById('profileNameInput')?.value||'').trim();
  const email=(document.getElementById('profileEmailInput')?.value||'').trim();
  if(!name){showToast('Введите имя','error');return;}
  if(S.user){S.user.name=name;S.user.email=email;S.user.initials=name.slice(0,2).toUpperCase();}
  document.getElementById('sideUserName').textContent=name;
  document.getElementById('sideAvatar').textContent=name.slice(0,2).toUpperCase();
  document.getElementById('profileName').textContent=name;
  document.getElementById('profileEmail').textContent=email;
  document.getElementById('bigAvatar').textContent=name.slice(0,2).toUpperCase();
  addActivity('Обновлён профиль');
  saveState();
  showToast('Профиль сохранён','success');
}

function changeLang(lang){
  S.lang=lang;
  document.getElementById('langSelect').value=lang;
  const sl=document.getElementById('settLang');if(sl)sl.value=lang;
  saveState();
  showToast('Язык изменён','info');
}

function changeCurrency(cur){
  S.currency=cur;
  document.getElementById('currSelect').value=cur;
  const sc=document.getElementById('settCurr');if(sc)sc.value=cur;
  renderProducts();
  renderVegetables();
  renderDashStats();
  recalc();
  calcVeg();
  saveState();
}

function exportData(){
  const blob=new Blob([JSON.stringify({products:S.products,vegetables:S.vegetables,activity:S.activity},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='tradehub-export.json';a.click();
  URL.revokeObjectURL(url);
  showToast('Данные экспортированы','success');
}

function resetData(){
  if(!confirm('Сбросить все данные? Это действие необратимо!'))return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// ========== RENDER ALL ==========
function renderAll(){
  if(!S.user)return;
  document.getElementById('sideAvatar').textContent=S.user.initials||'АД';
  document.getElementById('sideUserName').textContent=S.user.name||'Admin';
  const ba=document.getElementById('bigAvatar');if(ba)ba.textContent=S.user.initials||'АД';
  const pn=document.getElementById('profileName');if(pn)pn.textContent=S.user.name||'';
  const pe=document.getElementById('profileEmail');if(pe)pe.textContent=S.user.email||'';
  const pni=document.getElementById('profileNameInput');if(pni)pni.value=S.user.name||'';
  const pei=document.getElementById('profileEmailInput');if(pei)pei.value=S.user.email||'';
  document.getElementById('langSelect').value=S.lang;
  document.getElementById('currSelect').value=S.currency;
  const sc=document.getElementById('settCurr');if(sc)sc.value=S.currency;
  const sl=document.getElementById('settLang');if(sl)sl.value=S.lang;
  renderDashboard();
  renderProducts();
  renderVegetables();
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.otp-input').forEach((inp,idx,arr)=>{
    inp.addEventListener('input',()=>{
      inp.value=inp.value.replace(/\D/g,'').slice(0,1);
      if(inp.value&&idx<arr.length-1)arr[idx+1].focus();
    });
    inp.addEventListener('keydown',e=>{
      if(e.key==='Backspace'&&!inp.value&&idx>0)arr[idx-1].focus();
    });
  });
  document.getElementById('loginPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  document.getElementById('loginEmail').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('loginPass').focus();});
  const searchInput=document.getElementById('searchInput');
  if(searchInput)searchInput.addEventListener('input',debouncedRenderProducts);
  const vegSearch=document.getElementById('vegSearch');
  if(vegSearch)vegSearch.addEventListener('input',debouncedRenderVeg);
  const theadEl=document.querySelector('#productsTable thead');
  if(theadEl)theadEl.addEventListener('click',e=>{
    const th=e.target.closest('th[data-sort]');
    if(!th)return;
    const col=th.dataset.sort;
    if(S.productSort.col===col)S.productSort.dir*=-1;
    else{S.productSort.col=col;S.productSort.dir=1;}
    renderProducts();
  });
  const todayEl=document.getElementById('dashDate');
  if(todayEl)todayEl.textContent=new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  document.querySelectorAll('.modal-overlay').forEach(overlay=>{
    overlay.addEventListener('click',e=>{if(e.target===overlay){overlay.classList.remove('open');_editProductId=null;_editVegId=null;}});
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
      _editProductId=null;_editVegId=null;
    }
  });
});

window.addEventListener('load',()=>{
  loadState();
  setTimeout(()=>{
    const loader=document.getElementById('loader');
    loader.classList.add('hidden');
    setTimeout(()=>loader.remove(),600);
  },900);
});