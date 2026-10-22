# Sinch & Save · Frontend

React + Vite dashboard. Talks to the backend over HTTP.

## Run
Start the backend first, then:
```bash
npm install
cp .env.example .env     # optional; defaults to http://127.0.0.1:8000
npm run dev
```
Open http://localhost:5173

## Build
```bash
npm run build
```

## Structure
| File | What it shows |
|---|---|
| src/App.jsx | Loads data and passes it to each section |
| src/api.js | Every backend call, plus the saved login session |
| src/theme.js | Colors, money formatting, month list |
| src/components/AuthPage.jsx | Log in, create account, try the demo |
| src/components/Header.jsx | Name, log out and month dropdown |
| src/components/SafeToSpend.jsx | Weekly cap card |
| src/components/SummaryCards.jsx | Earned, spent, saved |
| src/components/TerrariumJar.jsx | Savings jar and goal editing |
| src/components/EntryForm.jsx | Log income or an expense |
| src/components/WeeklyCaps.jsx | Caps and monthly bills |
| src/components/EarnedSpentChart.jsx | Weekly or monthly bars |
| src/components/CategoryDonut.jsx | Spending by category |
| src/components/SavingsTrend.jsx | Savings over time |
| src/components/RecentEntries.jsx | Entry list with delete |
