const grade = document.getElementById("grade");
const room = document.getElementById("room");
const taskList = document.getElementById("taskList");
const sortBtn = document.getElementById("sortBtn");
const sortMenu = document.getElementById("sortMenu");

let currentSort = "deadline";

const roomData = {
  m1:["1/1","1/2"],
  m2:["2/1"],
  m3:["3/1"]
};

const tasks = [
{
grade:"m1",
room:"1/1",
title:"ภาษาไทย",
detail:"Ex.เขียนเรียงความ 15 บรรทัด",
date:"2026-02-07",
deadline:"2026-02-16",
submitted:0,
total:30
},
{
grade:"m1",
room:"1/1",
title:"ภาษาอังกฤษ",
detail:"เขียน Vocab 50 คำ",
date:"2026-02-07",
deadline:"2026-02-05",
submitted:30,
total:30
}
];

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

room.addEventListener("change",loadTasks);

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

function loadTasks(){
if(!grade.value || !room.value){
taskList.innerHTML="เลือกชั้นและห้องเพื่อแสดงงาน";
taskList.classList.add("empty");
return;
}

let filtered=tasks.filter(t=>t.grade===grade.value && t.room===room.value);

filtered.sort((a,b)=>{
return currentSort==="deadline"
? new Date(a.deadline)-new Date(b.deadline)
: new Date(a.date)-new Date(b.date);
});

render(filtered);
}

function render(data){
taskList.innerHTML="";
taskList.classList.remove("empty");

if(data.length===0){
taskList.innerHTML="ไม่มีงาน";
taskList.classList.add("empty");
return;
}

data.forEach(task=>{
const today=new Date();
const deadline=new Date(task.deadline);
const diff=Math.ceil((deadline-today)/(1000*60*60*24));

const isLate=diff<0;

const card=document.createElement("div");
card.className="task-card";

card.innerHTML=`
<div class="task-header">
<span>วันที่ ${formatDate(task.date)}</span>
<div class="status ${isLate?'status-late':'status-ok'}">
${isLate?'⛔ เกินกำหนดส่ง':'✔ อยู่ในระยะเวลาส่ง'}
<span class="status-extra">
${isLate?`เลยมา ${Math.abs(diff)} วัน`:`เหลืออีก ${diff} วัน`}
</span>
</div>
</div>

<div class="task-title">${task.title}</div>
<div class="task-detail">${task.detail}</div>

<div class="task-info">
<div>กำหนดส่ง: ${formatDate(task.deadline)}</div>
<div>ส่งแล้ว: ${task.submitted} คน</div>
<div>ยังไม่ส่ง: ${task.total-task.submitted} คน</div>
</div>
`;

card.querySelector(".status").addEventListener("click",function(){
this.classList.toggle("show");
});

taskList.appendChild(card);
});
}

function formatDate(dateStr){
const d=new Date(dateStr);
return d.toLocaleDateString("th-TH");
}
