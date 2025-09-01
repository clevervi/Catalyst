// Catalyst HR - User Management Page Module
// This is a lightweight scaffold to prevent missing script errors and prepare for richer features.

(function(){
  'use strict';

  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  function safeOn(el, ev, fn){
    if(el) el.addEventListener(ev, fn);
  }

  function initSearchAndFilters(){
    const search = q('#search-users');
    const role = q('#role-filter');
    const dept = q('#department-filter');
    const status = q('#status-filter');
    const clear = q('#clear-filters');

    safeOn(search, 'input', () => console.debug('[users] search:', search.value));
    safeOn(role, 'change', () => console.debug('[users] role:', role.value));
    safeOn(dept, 'change', () => console.debug('[users] department:', dept.value));
    safeOn(status, 'change', () => console.debug('[users] status:', status.value));
    safeOn(clear, 'click', () => {
      if (search) search.value = '';
      if (role) role.value = '';
      if (dept) dept.value = '';
      if (status) status.value = '';
      console.debug('[users] filters cleared');
    });
  }

  function initBulkSelection(){
    const selectAll = q('#select-all-users');
    const tbody = q('#users-tbody');
    if(!selectAll || !tbody) return;

    safeOn(selectAll, 'change', () => {
      qa('#users-tbody input[type="checkbox"]').forEach(cb => cb.checked = selectAll.checked);
      console.debug('[users] select all:', selectAll.checked);
    });
  }

  function initModals(){
    // Add basic handlers if elements exist; full logic can be implemented later.
    safeOn(q('#save-user'), 'click', () => {
      console.debug('[users] save-user clicked');
      // Placeholder: validate form and persist
    });
  }

  function init(){
    console.info('✅ user-management module loaded');
    initSearchAndFilters();
    initBulkSelection();
    initModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

