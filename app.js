// ----------------------
// CONFIG
// ----------------------
const sheetMap = {
  m1: '1Mngj7eQ0y2Eq3n0LROrdRDD1x6lDQQOvNeh8GOD68gg',
  m2: '14EdjUixaiDpaSvM7KV0gLWtDPWKyyfWMD12rFr94TnA',
  m3: '1bZ7VXP3QKUEUnmaUjNmnq5IuIzZXMI3mmgRQ1ZQbOcA',
  m4: '15QijGegnARQ9Rhv1q41_VxhCCKG6Day0YglHuNfMGzs',
  m5: '1dAy9GQlaWt2RFiBjIX1pP-YWiaNW4vTshviOBo2bWpQ',
  m6: '1nW8v1EwVRUPzLxBvNF3ec50mr9zwqoQnI3YZSsCdpdY'
};

const CACHE_TTL = 5 * 60 * 1000;

// ----------------------
const grade = document.getElementById("grade");
const room = document.getElementById("room");
const taskList = document.getElementById("taskList");
const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");

let currentSort = "deadline";

// ----------------------
// ROOM GENERATOR
// ----------------------
const roomData = {
  m1: Array.from({length:16}, (_,i)=>`1/${i+1}`),
  m2: Array.from({length:15}, (_,i)=>`2/${i+1}`),
  m3: Array.from({length:15}, (_,i)=>`3/${i+1}`),
  m4: Array.from({length:10}, (_,i)=>`4/${i+1}`),
  m5: Array.from({length:10}, (_,i)=>`5/${i+1}`),
  m6: Array.from({length:10}, (_,i)=>`6/${i+1}`)
};

// ----------------------
// CHANGE GRADE
// ----------------------
grade.addEventListener("change",()=>{
  room.innerHTML='<option value="">เลือกห้อง</option>';
  taskList.innerHTML="เลือกชั้นและห้องเพื่อแสดงงาน";
  taskList.classList.add("empty");

  if(!roomData[grade.value]) return;

  roomData[grade.value].forEach(r=>{
    const opt=document.createElement("option");
    opt.value=r;
    opt.textContent=r;
    room.appendChild(opt);
  });
});

room.addEventListener("change", loadTasks);

// ----------------------
// SORT
// ----------------------
sortBtn.addEventListener("click",()=>{
  sortMenu.classList.toggle("show");
});

sortMenu.addEventListener("click",(e)=>{
  if(e.target.dataset.sort){
    currentSort=e.target.dataset.sort;
    sortBtn.textContent=e.target.textContent+" ▾";
    sortMenu.classList.remove("show");
    loadTasks();
  }
});

// ----------------------
// LOAD TASKS
// ----------------------
function loadTasks(){
  if(!grade.value || !room.value) return;

  const cacheKey = `tasks_${grade.value}_${room.value}`;
  const cached = localStorage.getItem(cacheKey);

  if(cached){
    const data = JSON.parse(cached);
    if(Date.now() - data.time < CACHE_TTL){
      render(data.rows);
      return;
    }
  }

  fetchFromSheet(grade.value, room.value, cacheKey);
}

// ----------------------
// FETCH FROM SHEET
// ----------------------
function fetchFromSheet(gradeVal, roomVal, cacheKey){

  taskList.classList.add("empty");
  taskList.innerHTML="กำลังโหลดข้อมูล...";

  const url = `https://docs.google.com/spreadsheets/d/${sheetMap[gradeVal]}/gviz/tq?tqx=out:json&sheet=${roomVal}`;

  fetch(url)
  .then(res=>res.text())
  .then(text=>{
    const json = JSON.parse(text.substring(47).slice(0,-2));
    const rows = json.table.rows || [];

    localStorage.setItem(cacheKey, JSON.stringify({
      time: Date.now(),
      rows
    }));

    render(rows);
  })
  .catch(()=>{
    taskList.innerHTML="ไม่สามารถโหลดข้อมูลได้";
  });
}

// ----------------------
// RENDER
// ----------------------
function render(rows){

  function render(rows){

  taskList.innerHTML="";
  taskList.classList.remove("empty");

  if(rows.length===0){
    taskList.innerHTML="ไม่มีงาน";
    taskList.classList.add("empty");
    return;
  }

  let tasks = rows.map(r=>({
    date:      r.c[0]?.f || r.c[0]?.v || "-",
    title:     r.c[1]?.v || "-",
    detail:    r.c[2]?.v || "-",
    deadline:  r.c[3]?.f || r.c[3]?.v || "-",
    status:    r.c[4]?.v || "-",        // ✅ ดึงสถานะจากชีท
    remain:    r.c[5]?.v || "",         // ✅ ดึงเหลือเวลา/เลยมา
    submitted: r.c[6]?.v ?? 0,
    notSent:   r.c[7]?.v ?? 0,
    numbers:   r.c[8]?.v || "-"
  }));

  tasks.sort((a,b)=>{
    return currentSort==="deadline"
      ? new Date(a.deadline)-new Date(b.deadline)
      : new Date(a.date)-new Date(b.date);
  });

  tasks.forEach(task=>{

    const isLate = task.status.includes("เกิน");

    const card=document.createElement("div");
    card.className="task-card";

    card.innerHTML=`
      <div class="task-header">
        <span>วันที่ ${task.date}</span>

        <div class="status ${isLate?'status-late':'status-ok'}">
          ${task.status}
          <span class="status-extra">
            ${task.remain}
          </span>
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
          ${task.numbers}
        </div>
      </details>
    `;

    taskList.appendChild(card);
  });
}
    taskList.appendChild(card);
  });
}

