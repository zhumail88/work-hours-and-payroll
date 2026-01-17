**Work Hours and Payroll Tracker**

A modern application built with React.js, and Firebase to manage work hours and streamline payroll processing.

**Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

**Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js 18+**
- **npm**, **pnpm**, or **yarn**
- A **Google Account** (to obtain a Gemini API key) (AI features will be added soon)
- A **Firebase Project** (Free tier/Spark plan is sufficient)

**Installation & Setup**

**1\. Clone the Repository**

git clone <https://github.com/zhumail88/work-hours-and-payroll.git>

cd work-hours-and-payroll

**2\. Install Dependencies**

npm install

**3\. Configure Environment Variables**

Create a file named .env.local in the root directory and add your Gemini API key:

Code snippet

GEMINI_API_KEY=your_gemini_api_key_here

**4\. Set Up Firebase**

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project (or select an existing one).
- **Enable Services:**
  - **Authentication:** Enable at least one provider (e.g., Google or Email/Password).
  - **Firestore Database:** Create a database (start in **Test Mode** for development).
- **Register App:**
  - Go to **Project Settings** > **General**.
  - Under "Your apps", click the **Web icon (&lt;/&gt;)**.
  - Register the app and copy the firebaseConfig object.

**5\. Initialize Firebase in Code**

Create or update lib/firebase.ts (or src/lib/firebase.ts) with the following code:

TypeScript

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent multiple initializations in Next.js

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

**6\. Update Environment Variables**

Add your Firebase credentials to your .env.local file:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

\[!NOTE\] Keys starting with NEXT_PUBLIC_ are safe to expose on the client side as they are required for Firebase client-side communication.

**Running the App**

Once configured, start the development server:

Bash

npm run dev

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.
