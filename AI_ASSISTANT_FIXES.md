# AI Assistant - Law References Fix

## Problem

The AI assistant was not displaying law references in the chat drawer. Users would ask questions about UAE laws, but no legal citations or related laws would appear below the answers.

## Root Cause

Both the client-side and server-side `generateMockResponse` functions had their reference mapping broken:

1. **Client (`ChatDrawer.tsx`)**: Was returning empty `references: []` array
2. **Server (`ai-assistant.ts`)**: Was trying to match laws dynamically but the logic wasn't providing specific, relevant references for each question type

## Solution Implemented

### 1. Client-Side Fix (ChatDrawer.tsx)

**Enhanced the mock response generator** to:

- Return specific law IDs based on question keywords
- Create a comprehensive `lawReferencesMap` with mock law references including:
  - Law ID
  - Law Title
  - Legal Reference (official citation)
  - Excerpt (brief description)
- Map question types to relevant laws:
  - Student/Work Visa questions → `labor-6`, `labor-8`, etc.
  - Business questions → `corporate-1`, `corporate-2`, `corporate-3`
  - Labour/Employment questions → `labor-1`, `labor-2`, `labor-3`, `labor-5`
  - Leave/Holiday questions → `labor-2`, `labor-8`
  - Safety questions → `labor-5`, `labor-10`
  - Contract questions → `civil-1`, `civil-2`, `civil-3`
  - Wage/Salary questions → `labor-1`, `labor-4`, `labor-9`

### 2. Server-Side Fix (ai-assistant.ts)

**Improved the mock response generator** to:

- Match questions to specific law IDs rather than generic keyword matching
- Query the actual `laws` database array to fetch real law objects
- Extract proper law details (ID, title, legal reference, description)
- Return up to 3 most relevant laws with complete information
- Support the same question categories as the client

### 3. New Question Categories Supported

The AI assistant now provides references for:

| Question Type     | Referenced Laws                       | Example                       |
| ----------------- | ------------------------------------- | ----------------------------- |
| Student Visa      | labor-6, labor-8                      | "How to get a student visa"   |
| Work Visa         | labor-1, labor-4, labor-6             | "How to get a work visa"      |
| Starting Business | corporate-1, corporate-2, corporate-3 | "How to start a business"     |
| Labour/Work       | labor-1, labor-2, labor-3, labor-5    | "Tell me about labour law"    |
| Contracts         | civil-1, civil-2, civil-3             | "What about contract law"     |
| Wages/Salary      | labor-1, labor-4, labor-9             | "What is minimum wage"        |
| Leave/Vacation    | labor-2, labor-8                      | "How much leave do I get"     |
| Safety/Health     | labor-5, labor-10                     | "What about workplace safety" |
| Default           | labor-1, civil-1, corporate-1         | Any other question            |

## Changes Made

### File: `client/components/ChatDrawer.tsx`

- **Lines**: Mock response generator function
- **Change**: Added law reference mapping and return references instead of empty array
- **Impact**: References now display in chat drawer below AI answers

### File: `server/routes/ai-assistant.ts`

- **Lines**: Mock response generator function
- **Change**: Changed from keyword-based matching to question-type matching with real law lookups
- **Impact**: Consistent references returned from API endpoint

## How References Are Displayed

When the AI responds, references appear below the answer in this format:

```
Legal References:
┌─────────────────────────────────────┐
│ Working Hours and Overtime (labor-1) │
│ Citation: UAE Labour Law Federal...   │
│ View Full Article →                  │
└─────────────────────────────────────┘
```

Users can click on any reference to navigate to the full law detail page.

## Testing the Fix

To verify the fix works:

1. Start the dev server:

   ```bash
   pnpm dev
   ```

2. Open the app at `http://localhost:8080`

3. Click the AI chat button (bottom right)

4. Ask any question like:
   - "How to start a business in Dubai?"
   - "How to get a student visa?"
   - "What about labour law?"
   - "How much annual leave do I get?"

5. **Expected Result**: The AI answer will be followed by a "Legal References" section showing 2-3 relevant laws with proper citations

## Future Improvements

For production, consider:

1. **Replace Mock with Real AI**: Connect to an actual AI API (OpenAI, Gemini, Claude)
2. **Dynamic Law Matching**: Implement semantic search to find truly relevant laws based on answer content
3. **Database Integration**: Fetch laws from a database instead of in-memory arrays
4. **Vector Embeddings**: Use embeddings to find semantically similar laws
5. **Citation Extraction**: Parse AI responses to automatically extract law citations

## Notes

- Both client and server now return the same references (fallback and API-based)
- References are cached in the `lawReferencesMap` for performance
- Invalid law IDs are filtered out before returning
- Maximum 3 references returned per answer
- All mock references are accurate to actual UAE laws in the database
