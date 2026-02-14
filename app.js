// ================= CONFIG =================

const sheetMap = {
  m1: '1Mngj7eQ0y2Eq3n0LROrdRDD1x6lDQQOvNeh8GOD68gg',
  m2: '14EdjUixaiDpaSvM7KV0gLWtDPWKyyfWMD12rFr94TnA',
  m3: '1bZ7VXP3QKUEUnmaUjNmnq5IuIzZXMI3mmgRQ1ZQbOcA',
  m4: '15QijGegnARQ9Rhv1q41_VxhCCKG6Day0YglHuNfMGzs',
  m5: '1dAy9GQlaWt2RFiBjIX1pP-YWiaNW4vTshviOBo2bWpQ',
  m6: '1nW8v1EwVRUPzLxBvNF3ec50mr9zwqoQnI3YZSsCdpdY'
};

let currentSort = "deadline";
let currentRows = []; // 🔥 เก็บข้อมูลล่าสุดไว้ sort ใหม่ได้ทันที

const gradeSelect = document.getElementById("grade");
const roomSelect  = document.getElementById("room");
const taskList    = document.getElementById("taskList");
const sortBtn     = document.getElementById("sortBtn");
const sortMenu    = document.getElementById("sortMenu");


// ================= ROOM SELECT =================

gradeSelect.addEventListener("change", () => {

  roomSelect.innerHTML = `<option value="">เลือกห้อง</option>`;
  taskList.innerHTML = "เลือกชั้นและห้องเพื่อแสดงงาน";
  taskList.classList.add("empty");

  const grade = gradeSelect.value;
  if (!grade) return;

  const gradeNum = grade.replace("m", "");

  const maxRoom =
    grade === "m1" ? 16 :
    grade === "m2" ? 15 :
    grade === "m3" ? 15 : 10;

  for (let i = 1; i <= maxRoom; i++) {
    roomSelect.innerHTML += `
      <option value="${gradeNum}/${i}">
        ${gradeNum}/${i}
      </option>
    `;
  }

});

roomSelect.addEventListener("change", loadTasks);


// ================= LOAD DATA =================

function loadTasks() {

  const grade = gradeSelect.value;
  const room  = roomSelect.value;

  if (!grade || !room) return;

  taskList.innerHTML = "กำลังโหลดข้อมูล...";
  taskList.classList.add("empty");

  const url =
    `https://docs.google.com/spreadsheets/d/${sheetMap[grade]}/gviz/tq?tqx=out:json&sheet=${room}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {

      const json = JSON.parse(text.substring(47).slice(0, -2));
      currentRows = json.table.rows || [];

      renderTasks();

    })
    .catch(() => {
      taskList.innerHTML = "ไม่สามารถโหลดข้อมูลได้";
    });

}


// ================= SORT + RENDER =================

function renderTasks() {

  if (!currentRows.length) {
    taskList.innerHTML = "ยังไม่มีงานในห้องนี้";
    return;
  }

  // 🔥 sort ก่อน render
  const sorted = [...currentRows].sort((a, b) => {

    const deadlineA = new Date(a.c[3]?.v);
    const deadlineB = new Date(b.c[3]?.v);

    const dateA = new Date(a.c[0]?.v);
    const dateB = new Date(b.c[0]?.v);

    return currentSort === "deadline"
      ? deadlineA - deadlineB
      : dateA - dateB;

  });

  taskList.innerHTML = "";
  taskList.classList.remove("empty");

  sorted.forEach(r => {

    const date     = r.c[0]?.f || "-";
    const name     = r.c[1]?.v || "-";
    const detail   = r.c[2]?.v || "-";
    const deadline = r.c[3]?.f || "-";
    const status   = r.c[4]?.v || "";
    const sent     = r.c[6]?.v ?? 0;
    const notSent  = r.c[7]?.v ?? 0;

    taskList.innerHTML += `
      <div class="task-card">

        <div class="task-header">
          <span>วันที่ ${date}</span>
          <span class="status-badge">${status}</span>
        </div>

        <div class="task-title">${name}</div>
        <div class="task-detail">${detail}</div>

        <div class="task-info">
          <span>กำหนดส่ง: ${deadline}</span>
          <span>ส่งแล้ว: ${sent} คน</span>
          <span>ยังไม่ส่ง: ${notSent} คน</span>
        </div>

      </div>
    `;

  });

}


// ================= SORT DROPDOWN =================

sortBtn.addEventListener("click", () => {
  sortMenu.classList.toggle("show");
});

sortMenu.querySelectorAll("div").forEach(item => {

  item.addEventListener("click", () => {

    currentSort = item.dataset.sort;
    sortBtn.innerText = item.innerText + " ▾";
    sortMenu.classList.remove("show");

    renderTasks(); // 🔥 ไม่ fetch ใหม่ แค่ sort ใหม่

  });

});
