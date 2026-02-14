// ==========================
// CONFIG
// ==========================
const roomConfig = {
  m1: 16,
  m2: 15,
  m3: 15,
  m4: 10,
  m5: 10,
  m6: 10
};

const sheetMap = {
  m1: '1Mngj7eQ0y2Eq3n0LROrdRDD1x6lDQQOvNeh8GOD68gg',
  m2: '14EdjUixaiDpaSvM7KV0gLWtDPWKyyfWMD12rFr94TnA',
  m3: '1bZ7VXP3QKUEUnmaUjNmnq5IuIzZXMI3mmgRQ1ZQbOcA',
  m4: '15QijGegnARQ9Rhv1q41_VxhCCKG6Day0YglHuNfMGzs',
  m5: '1dAy9GQlaWt2RFiBjIX1pP-YWiaNW4vTshviOBo2bWpQ',
  m6: '1nW8v1EwVRUPzLxBvNF3ec50mr9zwqoQnI3YZSsCdpdY'
};

const CACHE_TTL = 5 * 60 * 1000;

// ==========================
// DOM
// ==========================

const gradeSelect = document.getElementById("grade");
const roomSelect  = document.getElementById("room");
const taskList    = document.getElementById("taskList");
const sortBtn     = document.getElementById("sortBtn");
const sortMenu    = document.getElementById("sortMenu");

let currentSort = "deadline";

// ==========================
// GRADE CHANGE
// ==========================

gradeSelect.addEventListener("change", () => {

  roomSelect.innerHTML = '<option value="">เลือกห้อง</option>';
  taskList.innerHTML = "เลือกชั้นและห้องเพื่อแสดงงาน";
  taskList.classList.add("empty");

  const grade = gradeSelect.value;
  if (!grade) return;
  const gradeNum = grade.replace("m", "");
  const maxRoom = roomConfig[grade];

  for (let i = 1; i <= maxRoom; i++) {
    const opt = document.createElement("option");
    opt.value = `${gradeNum}/${i}`;
    opt.textContent = `${gradeNum}/${i}`;
    roomSelect.appendChild(opt);
  }
});
  
roomSelect.addEventListener("change", loadTasks);

// ==========================
// SORT
// ==========================

sortBtn.addEventListener("click", () => {
  sortMenu.classList.toggle("show");
});

sortMenu.addEventListener("click", (e) => {
  if (!e.target.dataset.sort) return;

  currentSort = e.target.dataset.sort;
  sortBtn.textContent = e.target.textContent + " ▾";
  sortMenu.classList.remove("show");
  loadTasks();
});

// ==========================
// LOAD TASKS
// ==========================

function loadTasks() {

  const grade = gradeSelect.value;
  const room  = roomSelect.value;

  if (!grade || !room) return;

  const cacheKey = `tasks_${grade}_${room}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < CACHE_TTL) {
      render(data.rows);
      return;
    }
  }

  fetchFromSheet(grade, room, cacheKey);
}

// ==========================
// FETCH SHEET
// ==========================

function fetchFromSheet(grade, room, cacheKey) {

  taskList.classList.add("empty");
  taskList.innerHTML = "กำลังโหลดข้อมูล...";

  const url = `https://docs.google.com/spreadsheets/d/${sheetMap[grade]}/gviz/tq?tqx=out:json&sheet=${room}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {

      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows || [];

      localStorage.setItem(cacheKey, JSON.stringify({
        time: Date.now(),
        rows
      }));

      render(rows);
    })
    .catch(() => {
      taskList.innerHTML = "ไม่สามารถโหลดข้อมูลได้";
      taskList.classList.add("empty");
    });
}

// ==========================
// RENDER
// ==========================
function parseThaiDate(str) {
  if (!str || str === "-") return new Date(0);

  const parts = str.split("/");
  if (parts.length !== 3) return new Date(str);

  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];

  return new Date(`${year}-${month}-${day}`);
}

function render(rows) {

  taskList.innerHTML = "";
  taskList.classList.remove("empty");

  if (rows.length === 0) {
    taskList.innerHTML = "ยังไม่มีงานในห้องนี้";
    taskList.classList.add("empty");
    return;
  }

  let tasks = rows.map(r => ({
    date:      r.c[0]?.f || r.c[0]?.v || "-",
    title:     r.c[1]?.v || "-",
    detail:    r.c[2]?.v || "-",
    deadline:  r.c[3]?.f || r.c[3]?.v || "-",
    status:    r.c[4]?.v || "",
    remain:    r.c[5]?.v || "",
    submitted: r.c[6]?.v ?? 0,
    notSent:   r.c[7]?.v ?? 0,
    numbers:   r.c[8]?.v || "-"
  }));

  tasks = tasks.filter(t => t.title !== "-");

  tasks.sort((a,b)=>{
  return currentSort === "deadline"
    ? parseThaiDate(a.deadline) - parseThaiDate(b.deadline)
    : parseThaiDate(a.date) - parseThaiDate(b.date);
});

  tasks.forEach(task => {

    const isLate = task.status.includes("เกิน");

    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <div class="task-header">
        <span>วันที่ ${task.date}</span>

        <div class="status ${isLate ? 'status-late' : 'status-ok'}">
          ${task.status}
          <span class="status-extra">${task.remain}</span>
        </div>
      </div>

      <div class="task-title">${task.title}</div>
      <div class="task-detail">${task.detail}</div>

      <div class="task-info">
        <div>กำหนดส่ง: ${task.deadline}</div>
        <div>ส่งแล้ว: ${task.submitted} คน</div>
      </div>

      <details class="not-sent-box">
        <summary>ยังไม่ส่ง: ${task.notSent} คน</summary>
        <div class="not-sent-list">
  ${task.numbers
    .split(",")
    .map(n => `<span class="student-badge">${n.trim()}</span>`)
    .join("")}
</div>
      </details>
    `;

    taskList.appendChild(card);
  });
}
// ==========================
// STATUS TOGGLE
// ==========================

document.addEventListener("click", function (e) {
  const status = e.target.closest(".status");
  if (!status) return;

  status.classList.toggle("show");
});




