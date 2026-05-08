import admin from 'firebase-admin';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if already initialized to prevent multiple initializations in development
if (!admin.apps.length) {
  try {
    // Read the service account json directly
    const serviceAccountPath = path.join(__dirname, 'firebase.config.json');
    
    // Fallback logic to read either the new generic name or the original name if it wasn't renamed
    let serviceAccount;
    if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    } else {
        const files = fs.readdirSync(__dirname);
        const jsonFile = files.find(file => file.endsWith('.json') && file.includes('firebase-adminsdk'));
        if (jsonFile) {
            serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, jsonFile), 'utf-8'));
        } else {
            throw new Error("Could not find Firebase service account JSON file in config directory.");
        }
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

export default admin;
