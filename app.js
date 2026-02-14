// config
const sortType = document.getElementById('sortType');
// รหัส Google Sheets แยกตามชั้นค้าบบ
const sheetMap = {
  m1: '1Mngj7eQ0y2Eq3n0LROrdRDD1x6lDQQOvNeh8GOD68gg',
  m2: '14EdjUixaiDpaSvM7KV0gLWtDPWKyyfWMD12rFr94TnA',
  m3: '1bZ7VXP3QKUEUnmaUjNmnq5IuIzZXMI3mmgRQ1ZQbOcA',
  m4: '15QijGegnARQ9Rhv1q41_VxhCCKG6Day0YglHuNfMGzs',
  m5: '1dAy9GQlaWt2RFiBjIX1pP-YWiaNW4vTshviOBo2bWpQ',
  m6: '1nW8v1EwVRUPzLxBvNF3ec50mr9zwqoQnI3YZSsCdpdY'
};

const CACHE_TTL = 5 * 60 * 1000; // แคช 5 นาที


const gradeSelect = document.getElementById('grade');
const roomSelect  = document.getElementById('room');
const taskList    = document.getElementById('taskList');

// เปลี่ยนชั้น

gradeSelect.addEventListener('change', () => {
  roomSelect.innerHTML = '<option value="">เลือกห้อง</option>';
  taskList.classList.add('empty');
  taskList.innerHTML = 'เลือกชั้นและห้องเพื่อแสดงงาน';

  const grade = gradeSelect.value;
  if (!grade) return;

  const gradeNum = grade.replace('m', '');

  const maxRoom =
    grade === 'm1' ? 16 :
    grade === 'm2' ? 15 :
    grade === 'm3' ? 15 : 10;

  for (let i = 1; i <= maxRoom; i++) {
    roomSelect.innerHTML += `
      <option value="${gradeNum}/${i}">
        ${gradeNum}/${i}
      </option>
    `;
  }
});

roomSelect.addEventListener('change', loadTasks);

// โหล่งาน

function loadTasks() {
  const grade = gradeSelect.value;
  const room  = roomSelect.value;
  if (!grade || !room) return;

  const cacheKey = `tasks_${grade}_${room}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < CACHE_TTL) {
      renderTasksByPeriod(data.rows);
      return;
    }
  }

  fetchFromSheet(grade, room, cacheKey);
}

// ดึงชีท

function fetchFromSheet(grade, room, cacheKey) {
  taskList.classList.add('empty');
  taskList.innerHTML = 'กำลังโหลดข้อมูล...';

  const url = `https://docs.google.com/spreadsheets/d/${sheetMap[grade]}/gviz/tq?tqx=out:json&sheet=${room}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows || [];

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          time: Date.now(),
          rows
        })
      );

      renderTasksByPeriod(rows);
    })
    .catch(() => {
      taskList.classList.add('empty');
      taskList.innerHTML = 'ไม่สามารถโหลดข้อมูลได้';
    });
}

// เรียกงานมาแสดง
function renderTasksByPeriod(rows) {
  taskList.innerHTML = '';
  taskList.classList.remove('empty');
  
  let hasTask = false;
  
const sortValue = sortType.value;

rows.sort((a, b) => {

  if (currentSort === "deadline") {
  rows.sort((a, b) => {
    return new Date(a.c[3]?.v) - new Date(b.c[3]?.v);
  });
} else {
  rows.sort((a, b) => {
    return new Date(a.c[0]?.v) - new Date(b.c[0]?.v);
  });
}
});
  sortType.addEventListener('change', loadTasks);

  rows.forEach(r => {

    const date      = r.c[0]?.f || r.c[0]?.v || '-';
    const taskName  = r.c[1]?.v || '-';
    const detail    = r.c[2]?.v || '-';
    const deadline  = r.c[3]?.f || r.c[3]?.v || '-';
    const status    = r.c[4]?.v || '';
    const remain    = r.c[5]?.v || '';
    const sent      = r.c[6]?.v ?? 0;
    const notSent   = r.c[7]?.v ?? 0;
    const numbers   = r.c[8]?.v || '-';

    if (!taskName || taskName === '-') return;

    hasTask = true;

    taskList.innerHTML += `
      <div class="task-card">

        <div class="task-header">
  <span>วันที่ ${date}</span>

  <span class="status-badge"
      data-remain="${remain}"
      onclick="toggleRemain(this)">
      ${status}
</span>
</div>

        <div class="task-title">${taskName}</div>
        <div class="task-detail">${detail}</div>

        <div class="task-info">
          <span>กำหนดส่ง: ${deadline}</span>
          <span>ส่งแล้ว: ${sent} คน</span>
        </div>

        <details class="not-sent-box">
          <summary>ยังไม่ส่ง: ${notSent} คน</summary>
          <div class="not-sent-list">
            ${numbers}
          </div>
        </details>

      </div>
    `;
  });

  if (!hasTask) {
    taskList.classList.add('empty');
    taskList.innerHTML = 'ยังไม่มีงานในห้องนี้';
  }
}
function toggleRemain(el) {

  const oldPopup = document.querySelector('.remain-popup');
  if (oldPopup) oldPopup.remove();

  const text = el.dataset.remain;
  if (!text || text === '-') return;

  const popup = document.createElement('div');
  popup.className = 'remain-popup';
  popup.innerText = text;

  el.parentElement.appendChild(popup);

  setTimeout(() => {
    popup.classList.add('show');
  }, 10);

  document.addEventListener('click', function handler(e) {
    if (!popup.contains(e.target) && e.target !== el) {
      popup.remove();
      document.removeEventListener('click', handler);
    }
  });
}

const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");

let currentSort = "deadline";

sortBtn.addEventListener("click", () => {
  sortMenu.classList.toggle("show");
});

sortMenu.querySelectorAll("div").forEach(item => {
  item.addEventListener("click", () => {
    currentSort = item.dataset.sort;
    sortBtn.innerText = item.innerText + " ▾";
    sortMenu.classList.remove("show");

    loadTasks(); // โหลดใหม่ตาม sort
  });
});



