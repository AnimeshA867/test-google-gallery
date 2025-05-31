This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Google Drive Gallery

A public read-only gallery that displays images from a Google Drive folder.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Google Drive API Setup:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Drive API
   - Create credentials (API Key)
   - Make sure to restrict the API key to Google Drive API

3. **Configure environment variables:**
   Create a `.env.local` file with:

   ```
   GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
   GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id
   ```

4. **Make Google Drive folder public:**

   - Share your Google Drive folder with "Anyone with the link can view"
   - Copy the folder ID from the URL (the part after `/folders/`)

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Features

- 📸 Displays images from Google Drive folder
- 🔍 Click to view full-size images
- 📱 Responsive grid layout
- 🌙 Dark mode support
- 🚀 Built with Next.js 15 and Tailwind CSS

## Deployment

Deploy on Vercel or any other platform that supports Next.js. Make sure to set the environment variables in your deployment platform.
