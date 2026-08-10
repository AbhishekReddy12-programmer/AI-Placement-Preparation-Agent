# Google Sheets Setup Guide

To configure the student database for the Daily Placement Agent workflow, follow these steps to set up your Google Sheet:

## 1. Create the Spreadsheet
- Go to Google Sheets (https://sheets.google.com) and create a blank spreadsheet.
- Rename the spreadsheet to **Exactly**: `PlacementAgent`

## 2. Set Up the Columns
On the first sheet (default named `Sheet1`), configure the first row with the following column headers. Make sure spelling and capitalization match exactly:

| Column A | Column B | Column C | Column D  | Column E | Column F      |
|----------|----------|----------|-----------|----------|---------------|
| **Name** | **Email**| **Date** | **Aptitude**| **Coding**| **Interview Tip**|

### Column Descriptions:
- **Name**: The student's full name.
- **Email**: The student's primary email address (where the daily emails will be sent).
- **Date**: The date of the last placement preparation email sent (format: `YYYY-MM-DD`). The workflow updates this.
- **Aptitude**: Stores the last generated aptitude question and answer. The workflow updates this.
- **Coding**: Stores the last generated coding question. The workflow updates this.
- **Interview Tip**: Stores the last generated interview tip. The workflow updates this.

## 3. Populate Dummy Student Data
Add 1-2 rows of test student data so you can test the workflow:
- **Name**: John Doe
- **Email**: `your-test-email@example.com` (use your own email to test receiving the email)
- Leave the other columns (**Date**, **Aptitude**, **Coding**, **Interview Tip**) blank or with placeholder values; n8n will update them automatically.

## 4. Share Access / Authenticate in n8n
- When configuring the Google Sheets node in n8n, you will create a Google Sheets API credential.
- Follow n8n's OAuth2 authorization flow to link your Google account so n8n can read/write the `PlacementAgent` spreadsheet.
- Make sure that the user account you authorize in n8n has edit access to this spreadsheet.
