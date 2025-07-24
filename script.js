function formatThaiDate(dateObj) {
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function getTodayKey() {
  const d = new Date();
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function pad(num, len) {
  return num.toString().padStart(len, '0');
}

function drawNumbers() {
  return {
    two: pad(Math.floor(Math.random() * 100), 2),
    three: pad(Math.floor(Math.random() * 1000), 3),
    four: pad(Math.floor(Math.random() * 10000), 4),
    time: new Date().toLocaleTimeString()
  };
}

function drawNewRound() {
  const key = getTodayKey();
  let history = JSON.parse(localStorage.getItem('lottoRounds')) || {};
  if (!history[key]) history[key] = [];

  const twoEl = document.getElementById('twoDigit');
  const threeEl = document.getElementById('threeDigit');
  const fourEl = document.getElementById('fourDigit');

  twoEl.classList.add('flashing');
  threeEl.classList.add('flashing');
  fourEl.classList.add('flashing');

  let count = 0;
  const interval = setInterval(() => {
    twoEl.textContent = pad(Math.floor(Math.random() * 100), 2);
    threeEl.textContent = pad(Math.floor(Math.random() * 1000), 3);
    fourEl.textContent = pad(Math.floor(Math.random() * 10000), 4);
    count++;
    if (count > 15) {
      clearInterval(interval);

      const newRound = drawNumbers();
      twoEl.textContent = newRound.two;
      threeEl.textContent = newRound.three;
      fourEl.textContent = newRound.four;

      twoEl.classList.remove('flashing');
      threeEl.classList.remove('flashing');
      fourEl.classList.remove('flashing');

      history[key].push(newRound);
      localStorage.setItem('lottoRounds', JSON.stringify(history));
      renderHistory(history);
    }
  }, 80);
}

function renderHistory(history) {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = "";
  const sortedDays = Object.keys(history).sort((a, b) => b.localeCompare(a));

  for (const day of sortedDays) {
    const dateObj = new Date(day);
    const dateDisplay = formatThaiDate(dateObj);
    const rounds = history[day];

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const el = document.createElement('div');
      el.className = "history-item";
      el.innerHTML = `
        <strong>${dateDisplay} - รอบ ${i + 1}</strong><br>
        เวลา: ${round.time}<br>
        2 ตัว: ${round.two} |
        3 ตัว: ${round.three} |
        4 ตัว: ${round.four}
      `;
      historyList.appendChild(el);
    }
  }
}

function init() {
  const today = new Date();
  document.getElementById('today').textContent = `ประจำวันที่ ${formatThaiDate(today)}`;

  const history = JSON.parse(localStorage.getItem('lottoRounds')) || {};
  const todayKey = getTodayKey();
  if (history[todayKey]?.length) {
    const last = history[todayKey].slice(-1)[0];
    document.getElementById('twoDigit').textContent = last.two;
    document.getElementById('threeDigit').textContent = last.three;
    document.getElementById('fourDigit').textContent = last.four;
  }

  renderHistory(history);
}

init();

function clearHistory() {
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบประวัติทั้งหมด?")) {
    localStorage.removeItem("lottoRounds");
    document.getElementById('historyList').innerHTML = "";
    alert("ลบประวัติเรียบร้อยแล้ว");
  }
}

const form = document.getElementById('signupForm');
const registerSection = document.getElementById('register-section');
const logoutSection = document.getElementById('logout-section');
const logoutBtn = document.getElementById('logoutBtn');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert("สมัครสมาชิกสำเร็จ! ขอบคุณคุณ " + name);

  // ซ่อนฟอร์มสมัคร / แสดงปุ่มลงชื่อออก
  registerSection.style.display = "none";
  logoutSection.style.display = "block";

  form.reset();
});

// เมื่อคลิก "ลงชื่อออก"
logoutBtn.addEventListener('click', function () {
  // ซ่อนปุ่มออก / แสดงฟอร์มอีกครั้ง
  logoutSection.style.display = "none";
  registerSection.style.display = "block";
});
