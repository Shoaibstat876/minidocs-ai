# MiniDocs AI

MiniDocs AI is a lightweight collaborative document editor MVP built for the Ajaia AI-Native Full Stack Developer assignment.

The goal is not to recreate Google Docs completely. The goal is to demonstrate a practical product slice for document creation, editing, importing, sharing, persistence, and usability within a limited timebox.

## Live Demo

Add deployed URL here after deployment.

## Core Features

- Create a new document
- Rename a document
- Edit document content in the browser
- Save and reopen documents after refresh
- Basic rich-text editing:
  - Bold
  - Italic
  - Underline
  - Heading
  - Paragraph
  - Bulleted list
  - Numbered list
- Upload `.txt` or `.md` files and convert them into editable documents
- Simulated users through a user switcher
- Document ownership
- Share a document with another seeded user
- Clear distinction between owned documents and documents shared with the current user
- Local persistence using browser localStorage
- Basic validation/error handling for unsupported file types
- Automated test for document sharing access logic

## Seeded Users

The app uses simulated users instead of full authentication to keep the scope focused.

Available users:

- Muhammad Shoaib
- Reviewer User
- Team Member

To test sharing:

1. Open the app as Muhammad Shoaib.
2. Create or edit a document.
3. Share it with Reviewer User.
4. Switch the current user to Reviewer User.
5. The document will appear under "Shared With Me".

## File Upload Support

Supported file types:

- `.txt`
- `.md`

Uploaded files are imported as new editable documents. Unsupported file types show a validation message.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest
- localStorage for MVP persistence

## Local Setup

Install dependencies:

```bash
npm install