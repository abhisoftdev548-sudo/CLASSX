import admin from 'firebase-admin';

// Check if already initialized to prevent multiple initializations in development
if (!admin.apps.length) {
  try {
    // Read Firebase service account credentials from environment variable
    const firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!firebaseServiceAccount) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set. Please provide the Firebase service account credentials as a JSON string.");
    }

    // Parse the JSON string from environment variable
    const serviceAccount = JSON.parse(firebaseServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
    // Firebase Admin Initialization Error silently handled
  }
}

export default admin;
