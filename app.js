// config

// รหัส Google Sheets แยกตามชั้นค้าบบ
const sheetMap = {
  m1: '1kSamtZiqfCxgPrHI9SMA7xeW5mJtAKYjWbj0XRw12N4',
  m2: '1sRiajEs4iopNa9FrhnDTEZYVFdkzkdxKn_uhvbDURfA',
  m3: '1DmCj8_lb7tK2UtzVqhfMDzLUjihCpm8nxScMx8EQOq4',
  m4: '1V1PpuqmrDvvJDDHOHSjWG9gYqD4dOZG_MxICAGP4eeY',
  m5: '1mzKSVJGzp0gopWg61h4amwY7qILCCM25kVJ7TlSNvNw',
  m6: '1id5U6DzAfZSPkFK2Mkakhbb9nmLXjX68qxI88JViR4c'
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

  rows.forEach(r => {
    const date = r.c[0]?.v;
    if (!date) return;

    // ทุกช่อง +5
    for (let i = 1; i < r.c.length; i += 5) {
      const taskName = r.c[i]?.v;
      const deadline = r.c[i + 2]?.f || r.c[i + 1]?.v || '-';
      const sent     = r.c[i + 3]?.v ?? 0;
      const notSent  = r.c[i + 4]?.v ?? 0;

      if (!taskName || taskName === 'ไม่มีงาน') continue;

      hasTask = true;

      taskList.innerHTML += `
        <div class="task-card">
          <div class="task-meta">วันที่ ${date}</div>
          <div class="task-title">${taskName}</div>
          <div class="task-info">
            <span>กำหนดส่ง: ${deadline}</span>
            <span>ส่งแล้ว: ${sent} คน</span>
            <span>ยังไม่ส่ง: ${notSent} คน</span>
          </div>
        </div>
      `;
    }
  });

  if (!hasTask) {
    taskList.classList.add('empty');
    taskList.innerHTML = 'ยังไม่มีงานในห้องนี้';
  }
}
