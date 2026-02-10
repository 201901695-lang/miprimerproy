/* App de Inventario - JavaScript puro
   - Renderiza una lista de artículos con imagen, cantidad, precio y fecha
   - Busca, ordena y filtra
   - Modal con detalles
*/
(function(){
  const el = (id)=>document.getElementById(id)
  const grid = el('grid')
  const search = el('search')
  const sortSel = el('sort')
  const filterStock = el('filterStock')
  const modal = el('modal')
  const modalImage = el('modalImage')
  const modalDetails = el('modalDetails')
  const modalClose = el('modalClose')

  function svgData(name, color='#e6eefc'){
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial' font-size='36' fill='#0b2a4a'>${name}</text></svg>`
    return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg)
  }

  const sampleData = [
    {id:1,name:'Taladro percutor 18V',image:svgData('Taladro 18V','#fff2e6'),quantity:12,purchasePrice:89.50,purchaseDate:'2025-10-12',supplier:'Herramar'},
    {id:2,name:'Cinta métrica 5m',image:svgData('Cinta 5m','#e6f9ff'),quantity:4,purchasePrice:3.20,purchaseDate:'2026-01-05',supplier:'Medix'},
    {id:3,name:'Tornillo M6x30 (caja 100)',image:svgData('Tornillo M6','#f0e6ff'),quantity:0,purchasePrice:7.99,purchaseDate:'2024-11-20',supplier:'FastFix'},
    {id:4,name:'Llave ajustable 10"',image:svgData('Llave 10"','#eef6e6'),quantity:7,purchasePrice:12.30,purchaseDate:'2025-06-30',supplier:'Manos'},
    {id:5,name:'Pintura esmalte 1L (blanco)',image:svgData('Esmalte 1L','#fff4f0'),quantity:2,purchasePrice:15.00,purchaseDate:'2025-12-01',supplier:'ColoresSA'},
    {id:6,name:'Broca madera 8mm',image:svgData('Broca 8mm','#f2f8ff'),quantity:25,purchasePrice:1.20,purchaseDate:'2026-02-02',supplier:'TaladrosRUs'}
  ]

  let items = sampleData.slice()

  function formatPrice(v){ return v.toLocaleString('es-ES',{style:'currency',currency:'EUR'}) }
  function formatDate(d){ const dt=new Date(d); return dt.toLocaleDateString('es-ES') }

  function render(){
    const q = search.value.trim().toLowerCase()
    const sortBy = sortSel.value
    const filter = filterStock.value

    let list = items.filter(i=>{
      if(q){
        const text = (i.name+ ' ' + (i.supplier||'')).toLowerCase()
        if(!text.includes(q)) return false
      }
      if(filter==='low' && !(i.quantity>0 && i.quantity<=5)) return false
      if(filter==='out' && i.quantity!==0) return false
      return true
    })

    list.sort((a,b)=>{
      if(sortBy==='name') return a.name.localeCompare(b.name)
      if(sortBy==='quantity') return b.quantity - a.quantity
      if(sortBy==='price') return b.purchasePrice - a.purchasePrice
      if(sortBy==='date') return new Date(b.purchaseDate) - new Date(a.purchaseDate)
      return 0
    })

    grid.innerHTML = ''
    if(list.length===0){ grid.innerHTML = '<p class="muted">No hay resultados.</p>'; return }

    list.forEach(item=>{
      const card = document.createElement('article')
      card.className = 'card'
      card.tabIndex = 0
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="thumb" />
        <div class="info">
          <h3 class="name">${item.name}</h3>
          <div class="meta">Proveedor: ${item.supplier || '-'} • Comprado: ${formatDate(item.purchaseDate)}</div>
          <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
            <span class="badge ${item.quantity===0? 'red': item.quantity<=5? 'red':'green'}">${item.quantity} uds</span>
            <div class="right"><div class="price">${formatPrice(item.purchasePrice)}</div><div class="meta">/ unidad</div></div>
          </div>
        </div>`

      card.addEventListener('click', ()=>openModal(item))
      card.addEventListener('keypress', (e)=>{ if(e.key==='Enter') openModal(item) })
      grid.appendChild(card)
    })
  }

  function openModal(item){
    modalImage.src = item.image
    modalImage.alt = item.name
    modalDetails.innerHTML = `
      <h2 style="margin:0 0 8px">${item.name}</h2>
      <p style="margin:0 0 8px;color:var(--muted)">Proveedor: ${item.supplier || '-'}</p>
      <p style="margin:0 0 6px">Cantidad en stock: <strong>${item.quantity}</strong></p>
      <p style="margin:0 0 6px">Precio de compra: <strong>${formatPrice(item.purchasePrice)}</strong></p>
      <p style="margin:0 0 12px">Fecha de compra: <strong>${formatDate(item.purchaseDate)}</strong></p>
      <p style="margin:0;font-size:14px;color:var(--muted)">Valor total en inventario: <strong>${formatPrice(item.purchasePrice * item.quantity)}</strong></p>
    `
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  }

  function closeModal(){ modal.classList.add('hidden'); document.body.style.overflow = '' }

  // Events
  search.addEventListener('input', ()=>render())
  sortSel.addEventListener('change', ()=>render())
  filterStock.addEventListener('change', ()=>render())
  modalClose.addEventListener('click', closeModal)
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal() })
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal() })

  // Inicial
  render()
})();
