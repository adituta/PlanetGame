// ====== Navigație taburi ======
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'))
      btn.classList.add('active')
      const show = btn.getAttribute('data-tab')
      document.querySelectorAll('[data-panel]').forEach(p=>{
        p.hidden = p.getAttribute('data-panel')!==show
      })
      // refresh conținut tab curent
      renderAll()
    })
  })