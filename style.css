* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Prompt', sans-serif;
  background: linear-gradient(180deg, #f9fafb, #eef2f7);
  color: #111;
}

/* HEADER */

.app-header {
  backdrop-filter: blur(20px);
  background: rgba(255,255,255,0.7);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.school-logo {
  width: 38px;
}

.app-header h1 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.app-header span {
  font-size: 12px;
  color: #666;
}

/* MAIN */

.app {
  max-width: 880px;
  margin: 30px auto;
  padding: 20px;
}

/* CONTROLS */

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
}

select {
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  font-size: 14px;
  outline: none;
}

/* SECTION HEADER */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

/* SORT BUTTON */

.sort-wrapper {
  position: relative;
}

.sort-btn {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  border: none;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0,0,0,0.05);
}

.sort-menu {
  position: absolute;
  right: 0;
  top: 110%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  display: none;
  overflow: hidden;
  min-width: 140px;
}

.sort-menu div {
  padding: 12px;
  font-size: 13px;
  cursor: pointer;
}

.sort-menu div:hover {
  background: #f3f4f6;
}

.sort-menu.show {
  display: block;
}

/* TASK GRID */

.tasks {
  display: grid;
  gap: 18px;
}

/* TASK CARD */

.task-card {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(20px);
  border-radius: 22px;
  padding: 20px;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.08),
    inset 0 1px 1px rgba(255,255,255,0.6);
  transition: 0.25s ease;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.12),
    inset 0 1px 1px rgba(255,255,255,0.8);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  font-size: 13px;
  color: #6b7280;
}

.task-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 6px;
}

.task-detail {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.task-info {
  font-size: 13px;
  color: #444;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* STATUS BADGE */

.status-badge {
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.status-ok {
  background: rgba(52,199,89,0.15);
  color: #1f7a3f;
}

.status-late {
  background: rgba(255,59,48,0.15);
  color: #a11;
}

/* EMPTY STATE */

.tasks.empty {
  text-align: center;
  color: #9ca3af;
  padding: 50px 0;
}

/* FOOTER */

.app-footer {
  margin-top: 40px;
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
}

/* RESPONSIVE */

@media (max-width: 640px) {
  .controls {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .tasks {
    grid-template-columns: 1fr 1fr;
  }
}
