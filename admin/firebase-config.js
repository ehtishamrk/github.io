/**
 * AOLFS Firebase Configuration
 * ─────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it "aolfs-website"
 * 3. Go to Project Settings → "Your apps" → Web app (</>)
 * 4. Register app → copy your firebaseConfig object
 * 5. Replace ALL values below with your actual config
 *
 * FREE TIER LIMITS (more than enough for AOLFS):
 *   - Firestore: 1GB storage, 50K reads/day, 20K writes/day
 *   - Storage: 5GB storage, 1GB/day download
 *   - Auth: Unlimited users
 *
 * After filling in config:
 * 6. In Firebase Console → Authentication → Sign-in method → Enable "Email/Password"
 * 7. In Firebase Console → Firestore Database → Create database (start in production mode)
 * 8. In Firebase Console → Storage → Get started
 * 9. In Firebase Console → Authentication → Users → Add your admin email
 *
 * FIRESTORE SECURITY RULES (paste in Firebase Console → Firestore → Rules):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /{document=**} {
 *         allow read: if true;
 *         allow write: if request.auth != null;
 *       }
 *     }
 *   }
 *
 * STORAGE SECURITY RULES (paste in Firebase Console → Storage → Rules):
 *
 *   rules_version = '2';
 *   service firebase.storage {
 *     match /b/{bucket}/o {
 *       match /{allPaths=**} {
 *         allow read: if true;
 *         allow write: if request.auth != null;
 *       }
 *     }
 *   }
 * ─────────────────────────────────────────────────────────────
 */

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyB_xYWswd3QMlCNqGO_gZrYCik0tAiwITQ",
  authDomain:        "aolfs-website.firebaseapp.com",
  projectId:         "aolfs-website",
  storageBucket:     "aolfs-website.firebasestorage.app",
  messagingSenderId: "1014772230300",
  appId:             "1:1014772230300:web:c349b3fb03df20eaad2559"
};

// Export for use in admin panel
window.AOLFS_FIREBASE_CONFIG = FIREBASE_CONFIG;
