// ==========================================================================
// STATE MANAGEMENT & MOCK DATABASE
// ==========================================================================
const mockStudentDatabase = [
  {
    Name: "Alex Smith",
    Email: "alex.smith@university.edu",
    Date: "2026-08-09",
    Aptitude: "Question:\nWhat is the remainder when 2^100 is divided by 7?\n\nAnswer:\n2",
    Coding: "Reverse words in a sentence.\nInput: 'Hello World'\nOutput: 'World Hello'",
    InterviewTip: "Research the company's core values before the interview."
  },
  {
    Name: "Emma Watson",
    Email: "emma.w@university.edu",
    Date: "2026-08-09",
    Aptitude: "Question:\nIn a group of cows and chickens, the number of legs is 14 more than twice the number of heads. How many cows are there?\n\nAnswer:\n7",
    Coding: "Find the missing number in an array.\nInput: [1, 2, 4, 5]\nOutput: 3",
    InterviewTip: "Use the STAR method (Situation, Task, Action, Result) to answer behavioral questions."
  },
  {
    Name: "John Doe",
    Email: "john.doe@university.edu",
    Date: "Pending",
    Aptitude: "Pending",
    Coding: "Pending",
    InterviewTip: "Pending"
  }
];

// Current Student Session State
let studentXP = 0;
let aptitudeAnswered = false;
let codeRunCount = 0;

// Aptitude Question Data
const currentAptitude = {
  question: "A train covers a distance of 480 km at a uniform speed. If the speed had been 8 km/h less, then it would have taken 3 hours more to cover the same distance. What is the original speed of the train?",
  options: [
    { text: "32 km/h", isCorrect: false },
    { text: "40 km/h", isCorrect: true },
    { text: "48 km/h", isCorrect: false },
    { text: "56 km/h", isCorrect: false }
  ],
  explanation: "Let original speed be x km/h. Time taken = 480/x. New speed = x - 8. New time taken = 480/(x-8). Difference is 3 hours. So 480/(x-8) - 480/x = 3. Solving this quadratic equation gives x = 40 km/h."
};

// ==========================================================================
// NAVIGATION CONTROLLER
// ==========================================================================
const navStudent = document.getElementById('nav-student');
const navAdmin = document.getElementById('nav-admin');
const studentPortal = document.getElementById('student-portal');
const adminPanel = document.getElementById('admin-panel');

navStudent.addEventListener('click', () => {
  navStudent.classList.add('active');
  navAdmin.classList.remove('active');
  studentPortal.classList.add('active');
  adminPanel.classList.remove('active');
});

navAdmin.addEventListener('click', () => {
  navAdmin.classList.add('active');
  navStudent.classList.remove('active');
  adminPanel.classList.add('active');
  studentPortal.classList.remove('active');
  renderStudentTable();
});

// ==========================================================================
// STUDENT PANEL: APTITUDE SECTION
// ==========================================================================
function loadAptitudeQuestion() {
  const container = document.getElementById('aptitude-options');
  container.innerHTML = '';
  
  currentAptitude.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-prefix">${String.fromCharCode(65 + idx)}</span>${opt.text}`;
    btn.addEventListener('click', () => handleAptitudeSelect(idx, btn));
    container.appendChild(btn);
  });
}

function handleAptitudeSelect(selectedIndex, selectedBtn) {
  if (aptitudeAnswered) return;
  aptitudeAnswered = true;
  
  const options = document.querySelectorAll('.option-btn');
  const feedback = document.getElementById('aptitude-feedback');
  
  options.forEach((btn, idx) => {
    btn.disabled = true;
    if (currentAptitude.options[idx].isCorrect) {
      btn.classList.add('correct');
    }
  });

  const isCorrect = currentAptitude.options[selectedIndex].isCorrect;
  if (!isCorrect) {
    selectedBtn.classList.add('wrong');
    feedback.className = 'feedback-msg wrong-ans';
    feedback.innerHTML = `<strong>Incorrect.</strong> ${currentAptitude.explanation}`;
  } else {
    feedback.className = 'feedback-msg correct-ans';
    feedback.innerHTML = `<strong>Correct! +10 XP earned.</strong> ${currentAptitude.explanation}`;
    studentXP += 10;
    updateProgressRing();
  }
  
  feedback.classList.remove('hidden');
}

// ==========================================================================
// STUDENT PANEL: CODING SECTION
// ==========================================================================
const btnRunCode = document.getElementById('btn-run-code');
const codeEditor = document.getElementById('code-editor');
const codeConsole = document.getElementById('code-console');
const consoleLogs = document.getElementById('console-logs');

btnRunCode.addEventListener('click', () => {
  btnRunCode.disabled = true;
  btnRunCode.innerText = "Running Tests...";
  codeConsole.classList.remove('hidden');
  consoleLogs.innerText = "Initializing execution engine...\nCompiling code...";
  
  setTimeout(() => {
    try {
      const userCode = codeEditor.value;
      // Simple evaluator to verify code
      const resultEval = new Function('arr', `${userCode}\nreturn reverseArray(arr);`);
      const testResult = resultEval([1, 2, 3, 4]);
      
      const success = JSON.stringify(testResult) === JSON.stringify([4, 3, 2, 1]);
      
      if (success) {
        consoleLogs.innerHTML = `Test Case 1: [1, 2, 3, 4] -> Output: [4, 3, 2, 1] <span style="color: #10b981;">(Passed)</span>\nTest Case 2: [10, -2, 5] -> Output: [5, -2, 10] <span style="color: #10b981;">(Passed)</span>\n\n<strong style="color: #10b981;">SUCCESS: All test cases passed! +20 XP earned.</strong>`;
        if (codeRunCount === 0) {
          studentXP += 20;
          updateProgressRing();
          codeRunCount++;
        }
      } else {
        consoleLogs.innerHTML = `Test Case 1: [1, 2, 3, 4] -> Output: ${JSON.stringify(testResult)} <span style="color: #ef4444;">(Failed)</span>\nExpected: [4, 3, 2, 1]`;
      }
    } catch (err) {
      consoleLogs.innerHTML = `<span style="color: #ef4444;">Syntax Error: ${err.message}</span>`;
    }
    btnRunCode.disabled = false;
    btnRunCode.innerText = "Run Test Cases";
  }, 1000);
});

// ==========================================================================
// STUDENT PANEL: RESUME ANALYZER
// ==========================================================================
const dropzone = document.getElementById('resume-dropzone');
const fileInput = document.getElementById('resume-input');
const uploadProgress = document.getElementById('upload-progress-bar');
const progressFill = document.getElementById('resume-progress-fill');
const progressPercentVal = document.getElementById('progress-percent-val');
const resumeResults = document.getElementById('resume-results');
const btnResetResume = document.getElementById('btn-reset-resume');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    handleResumeUpload(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleResumeUpload(fileInput.files[0]);
  }
});

function handleResumeUpload(file) {
  if (file.type !== "application/pdf") {
    alert("Please upload a valid PDF resume file.");
    return;
  }
  
  dropzone.classList.add('hidden');
  uploadProgress.classList.remove('hidden');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    progressFill.style.width = `${progress}%`;
    progressPercentVal.innerText = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        uploadProgress.classList.add('hidden');
        showResumeFeedback();
      }, 500);
    }
  }, 100);
}

function showResumeFeedback() {
  resumeResults.classList.remove('hidden');
  
  // Animate ATS gauge score
  const score = 87;
  const circle = document.getElementById('ats-gauge-circle');
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  circle.style.strokeDashoffset = circumference;
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);
  
  document.getElementById('ats-score-value').innerText = score;
  
  // Set feedback values
  const skills = ["Python", "SQL", "Git", "n8n", "Docker", "Machine Learning", "FastAPI"];
  const weaknesses = [
    "No metrics-driven achievements (e.g. quantified project outcomes).",
    "Missing links to public GitHub profile or portfolio showcase."
  ];
  const suggestions = [
    "Add action verbs and numbers (e.g., 'Optimized system efficiency by 25%').",
    "Include a deployment section detailing your n8n workflow integrations."
  ];
  
  const skillsContainer = document.getElementById('resume-skills');
  skillsContainer.innerHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
  
  const weaknessesContainer = document.getElementById('resume-weaknesses');
  weaknessesContainer.innerHTML = weaknesses.map(w => `<li>${w}</li>`).join('');

  const suggestionsContainer = document.getElementById('resume-suggestions');
  suggestionsContainer.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
  
  studentXP += 20;
  updateProgressRing();
}

btnResetResume.addEventListener('click', () => {
  resumeResults.classList.add('hidden');
  dropzone.classList.remove('hidden');
  fileInput.value = '';
});

// ==========================================================================
// XP PROGRESS BAR
// ==========================================================================
function updateProgressRing() {
  const percentText = document.getElementById('progress-percent');
  const targetPercent = Math.min(Math.round((studentXP / 50) * 100), 100);
  percentText.innerText = `${targetPercent}%`;
}

// ==========================================================================
// ADMIN PANEL: DB RENDER & WORKFLOW SIMULATOR
// ==========================================================================
function renderStudentTable() {
  const tbody = document.getElementById('student-table-body');
  tbody.innerHTML = '';
  
  mockStudentDatabase.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${student.Name}</strong></td>
      <td>${student.Email}</td>
      <td><span class="db-date">${student.Date}</span></td>
      <td><div class="db-cell-truncate" title="${student.Aptitude}">${student.Aptitude}</div></td>
      <td><div class="db-cell-truncate" title="${student.Coding}">${student.Coding}</div></td>
      <td><div class="db-cell-truncate" title="${student.InterviewTip}">${student.InterviewTip}</div></td>
    `;
    tbody.appendChild(tr);
  });
}

// Pipeline workflow nodes
const btnTriggerAgent = document.getElementById('btn-trigger-agent');
const pipelineSimulation = document.getElementById('pipeline-simulation');
const pipelineLogs = document.getElementById('pipeline-log-text');
const pipelineStatus = document.getElementById('pipeline-status');

const nodes = [
  { id: 'node-cron', time: 1000, log: "[19:49:10] Workflow Triggered (Cron node started)..." },
  { id: 'node-sheets', time: 1500, log: "[19:49:11.5] Google Sheets Read: Queried registry. Found 3 students." },
  { id: 'node-gemini', time: 3000, log: "[19:49:13] Gemini API call triggered. Curation model processing prompts...\n[19:49:14.2] Prompt 1 (Aptitude) Generated.\n[19:49:15.1] Prompt 2 (Coding) Generated.\n[19:49:15.8] Prompt 3 (Tip) Generated." },
  { id: 'node-update', time: 1500, log: "[19:49:16] Google Sheets Update Row: Saved daily contents for John Doe." },
  { id: 'node-gmail', time: 1500, log: "[19:49:17.5] Gmail Service: Sending dispatch queue. Email dispatched successfully to: john.doe@university.edu." }
];

btnTriggerAgent.addEventListener('click', () => {
  btnTriggerAgent.disabled = true;
  pipelineSimulation.classList.remove('hidden');
  pipelineStatus.className = 'status-badge running';
  pipelineStatus.innerText = "Running...";
  pipelineLogs.innerText = "[19:49:09] Initializing worker execution...";
  
  // Reset nodes classes
  nodes.forEach(n => {
    const el = document.getElementById(n.id);
    el.className = 'pipeline-node';
  });

  let nodeIndex = 0;
  
  function executeNextNode() {
    if (nodeIndex >= nodes.length) {
      pipelineStatus.className = 'status-badge success';
      pipelineStatus.innerText = "Success";
      btnTriggerAgent.disabled = false;
      
      // Update dummy DB entry for John Doe to simulate n8n updates
      const john = mockStudentDatabase.find(s => s.Name === "John Doe");
      if (john) {
        john.Date = new Date().toISOString().split('T')[0];
        john.Aptitude = "Question:\nWhat is 25% of 200?\n\nAnswer:\n50";
        john.Coding = "Reverse an Array.\nInput: 1 2 3 4\nOutput: 4 3 2 1";
        john.InterviewTip = "Maintain eye contact while answering interview questions.";
      }
      renderStudentTable();
      return;
    }
    
    const node = nodes[nodeIndex];
    const el = document.getElementById(node.id);
    el.classList.add('active');
    pipelineLogs.innerText += `\n${node.log}`;
    
    // Auto-scroll logs
    const pre = pipelineLogs.parentElement;
    pre.scrollTop = pre.scrollHeight;

    setTimeout(() => {
      el.classList.remove('active');
      el.classList.add('success');
      nodeIndex++;
      executeNextNode();
    }, node.time);
  }

  setTimeout(executeNextNode, 800);
});

// Initialize on page load
loadAptitudeQuestion();
updateProgressRing();
