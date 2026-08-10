# AI Placement Preparation & Resume Feedback Agent

An end-to-end automated system built for B.Tech (CSE - AI) placement preparation. Powered by **n8n**, **Google Gemini 3.5 Flash Lite**, **Google Sheets**, **Google Drive**, and **Gmail**.

---

## 📁 Project Structure

```text
placement-agent/
├── docker-compose.yml           # Docker setup for n8n
├── README.md                    # Complete project documentation
├── workflow.json                # Exported n8n workflow (both workflows)
├── prompt.txt                   # Prompts & system instructions
├── Sample_Student_Resume.pdf    # Sample PDF resume for testing
├── GoogleSheet/
│   └── setup_guide.md           # Google Sheets column schema & instructions
├── dashboard/                   # Web Dashboard
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── screenshots/                 # Workflow diagrams & mockups
```

---

## ⚡ Key Workflows Included

### 1. Daily Placement Preparation Workflow
* **Trigger**: Scheduled Cron / Manual Trigger.
* **Read Students**: Fetches student details from Google Sheet (`1q8Sj3jXcdRFxYKnedRa097TkcESxMnvhiN6UrCKKwIs`, tab `Questions`).
* **Parallel Gemini AI Generation**:
  * **Aptitude Question & Explanation**
  * **Coding Challenge & Solution**
  * **Behavioral Interview Tip**
* **Spreadsheet Logging**: Appends generated questions, answers, and explanations to Google Sheets.
* **HTML Email Delivery**: Formats daily packages into responsive HTML email cards and sends via Gmail (`emailType: "html"`).

### 2. AI Resume Feedback Workflow
* **Trigger**: Google Drive Trigger (watches uploaded `.pdf` files).
* **Download File**: Downloads binary file content (`data`).
* **Extract PDF Text**: Parses text from PDF resumes.
* **Prepare Prompt**: JavaScript Code node that sanitizes text and builds Gemini AI prompt payload.
* **Gemini AI Analysis**: Analyzes resume content using `gemini-3.5-flash-lite` to generate:
  * **Skills Extracted**
  * **Weaknesses & Gaps**
  * **Suggestions for Improvement**
  * **ATS Score (out of 100)**
* **HTML Feedback Report**: Delivers an ATS scorecard email to the student.

---

## 🚀 Setup & Run Instructions

### 1. Start n8n Server via Docker
```bash
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```
Access n8n in your browser at: `http://localhost:5678`

### 2. Configure Credentials in n8n
1. **Google Sheets**: Add `Google Sheets OAuth2 API` credential.
2. **Gmail**: Add `Gmail OAuth2` credential.
3. **Google Drive**: Add `Google Drive OAuth2 API` credential.
4. **Gemini API Key**: Key passed in HTTP query parameter (`key=YOUR_GEMINI_API_KEY`). Model endpoint set to `gemini-3.5-flash-lite`.

### 3. Import Workflow
1. In n8n UI, go to **Workflows** ➔ **Add Workflow** ➔ **Import from file...**.
2. Select [`workflow.json`](file:///workflow.json).
3. Connect your Google credentials to the respective nodes and save!

---

## 📊 Google Sheets Schema

* **Spreadsheet ID**: `1q8Sj3jXcdRFxYKnedRa097TkcESxMnvhiN6UrCKKwIs`
* **Tab Name**: `Questions`
* **Columns**: `question`, `A`, `B`, `C`, `D`, `answer`, `explanation`

---

## 📄 Testing Sample Resume

Use the included sample resume [`Sample_Student_Resume.pdf`](file:///Sample_Student_Resume.pdf) to test the Resume Feedback workflow:
1. Upload `Sample_Student_Resume.pdf` to your Google Drive.
2. Run the **Google Drive Trigger** node in n8n.
3. Check your inbox for the **Resume Analysis Report**!
