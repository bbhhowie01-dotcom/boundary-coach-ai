# Boundary Coach

不是教你如何回覆別人。而是陪你先聽見自己。

用最溫柔的語氣，守護最堅定的您。

這不是回信工具，而是一位溫暖、穩定、安全的陪伴者。當使用者受到訊息影響時，先接住、照顧、理解自己，最後才討論如何回應。

完整產品規格見 [`docs/PRODUCT.md`](./docs/PRODUCT.md)。

## 核心流程（13 階段）

1. 接住使用者  
2. 生理照顧 + 呼吸引導  
3. 心理安頓  
4. 情緒陪伴  
5. 情緒覺察（串流）  
6. 情緒來源探索  
7. 自我理解（串流）  
8. 自我辯證  
9. 雙方理解（AI）  
10. 界線建立  
11. 訊息分析（AI）← 此時才分析  
12. 回應風格 + 稱謂選擇  
13. 正式回覆（串流）← 先理解與感謝，再表達  
14. 陪伴總結  

## 技術棧

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS 4
- OpenAI API

## 專案結構

```
src/
├── app/
│   ├── api/coach/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/coach/          # 首頁表單 + 13 階段 UI
├── lib/
│   ├── openai.ts
│   ├── prompts/               # System + task prompts
│   └── stages/                # 階段設定與靜態文案
└── types/coach.ts
```

## 本地開發

```bash
npm install
cp .env.example .env.local
```

在 `.env.local` 填入：

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 免責聲明

本產品僅供情緒陪伴與自我覺察參考，不能取代專業心理諮商或法律建議。若你正處於高風險關係或人身安全威脅，請尋求專業協助。
