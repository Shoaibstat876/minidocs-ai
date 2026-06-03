# Submission

## Project Name
MiniDocs AI

## Summary
MiniDocs AI is a lightweight collaborative document editor MVP built for the Ajaia AI-Native Full Stack Developer assignment.

## Included Materials
- Source code
- README.md
- ARCHITECTURE.md
- AI_WORKFLOW.md
- SUBMISSION.md
- WALKTHROUGH_VIDEO.txt
- Automated sharing logic test

## Live Product URL
Add Vercel URL here after deployment.

## Walkthrough Video URL
Add video URL here after recording.

## Seeded Users
- Muhammad Shoaib
- Reviewer User
- Team Member

## How To Test Sharing
1. Open the app as Muhammad Shoaib.
2. Create or edit a document.
3. Share it with Reviewer User.
4. Switch current user to Reviewer User.
5. Confirm the document appears under Shared With Me.

## What Is Working
- Create document
- Rename document
- Edit document content
- Save and reopen after refresh
- Basic rich-text formatting
- Upload .txt or .md file as editable document
- Owned and shared document distinction
- Share document with seeded user
- Automated sharing test
- Production build passes

## What Is Partial
- localStorage is used instead of hosted database
- Users are simulated instead of real authentication
- Sharing is basic access sharing, not role-based permissions
- No real-time collaboration

## Next Improvements
- Add Supabase or Postgres persistence
- Add authentication
- Add viewer/editor roles
- Add better rich-text editor state handling
- Add more tests
