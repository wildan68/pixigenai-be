import admin from 'firebase-admin'
import serviceAccount from './pixigenai-c02a8-firebase-adminsdk-24ia1-eb744b67ac.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;