// Minimal placeholder script
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('searchForm');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const q = document.getElementById('searchInput')?.value || '';
      alert('Search not implemented yet. You searched for: ' + q);
    });
  }
});
