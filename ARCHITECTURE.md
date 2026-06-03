# Architecture Note

MiniDocs AI is a lightweight collaborative document editor MVP inspired by Google Docs.

## What I Prioritized
- Create, rename, edit, save, and reopen documents
- Basic rich-text editing
- File import for .txt and .md files
- Seeded user sharing
- Owned vs shared document separation
- Browser localStorage persistence
- One automated test for sharing logic

## Key Decisions
Seeded users were used instead of full authentication to keep the timebox focused on document workflow and sharing.

localStorage was used for persistence so documents remain available after refresh. In a production version, I would move persistence to Supabase or Postgres.

The editor uses browser-based content editing and formatting commands for bold, italic, underline, headings, bullets, and numbered lists.

## Tradeoffs
I intentionally deprioritized real authentication, real-time collaboration, comments, version history, and database persistence.

## Verification
I manually tested document creation, renaming, editing, formatting, saving, refresh persistence, file upload, sharing, and user switching.

I also added an automated test for sharing access logic and confirmed npm test and npm run build both pass.
