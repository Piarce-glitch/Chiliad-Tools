/* ---------- Reactive state (сохраняется в localStorage) ---------- */
const state = new Proxy(
  JSON.parse(localStorage.getItem('ctState') || '{}'),
  {
    set(target, prop, value) {
      target[prop] = value;
      localStorage.setItem('ctState', JSON.stringify(target));

      // Синхронизация UI
      document.querySelectorAll(`[data-key="${prop}"]`).forEach(cb => {
        cb.checked = value;
      });

      // При необходимости отправляем запрос к бекенду
      if (prop.startsWith('open')) {
        fetch('https://YOUR_BACKEND_URL/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feature: prop, enabled: value })
        }).catch(console.error);
      }
      return true;
    }
  }
);

/* ---------- Инициализация переключателей ---------- */
document.querySelectorAll('.toggle').forEach(cb => {
  const key = cb.dataset.key;
  cb.checked = !!state[key];
  cb.addEventListener('change', () => (state[key] = cb.checked));
});

/* ---------- Таблица оружия (примерные данные) ---------- */
const weapons = [
  { faction: 'GTA', action: 'Spawn', text: 'AK‑47', description: 'Стандартный автомат' },
  { faction: 'LSPD', action: 'Delete', text: 'Pistol', description: 'Обычный пистолет' },
  // Добавьте свои строки при необходимости
];
const tbody = document.getElementById('weaponTableBody');
weapons.forEach(w => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="p-2 border-b">${w.faction}</td>
    <td class="p-2 border-b">${w.action}</td>
    <td class="p-2 border-b">${w.text}</td>
    <td class="p-2 border-b">${w.description}</td>
  `;
  tbody.appendChild(tr);
});

/* ---------- Логирование ---------- */
function log(msg) {
  const area = document.getElementById('logArea');
  area.textContent += \`[\${new Date().toLocaleTimeString()}] \${msg}\\n\`;
  area.scrollTop = area.scrollHeight;
}
document.getElementById('clearLog').addEventListener('click', () => {
  document.getElementById('logArea').textContent = '';
  log('Логи очищены');
});
log('Приложение загружено');
