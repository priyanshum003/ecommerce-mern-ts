import admin from 'firebase-admin';
import serviceAccount from '../../firebaseServiceAccountKey.json';

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    
});

export default firebaseApp;