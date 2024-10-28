// Import Firebase SDKs and functions
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC04QzoczMLF4p3qa1WjrcnKzke-pI5SRU",
  authDomain: "gamedlessons.firebaseapp.com",
  projectId: "gamedlessons",
  storageBucket: "gamedlessons.appspot.com",
  messagingSenderId: "346571176421",
  appId: "1:346571176421:web:7d5a0e2bffb096fa40970c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication and Firestore function
async function login() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Store user data in Firestore if new
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                synapsePoints: 0,
                // Add other default stats here
            });
        }

        // Redirect to home page after login
        window.location.href = "home.html";
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Check login state
onAuthStateChanged(auth, user => {
    if (user) {
        // User is logged in
        if (window.location.pathname.includes("login.html")) {
            window.location.href = "home.html";
        }
    } else {
        // User not logged in
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
    }
});

// Attach login function to login button
document.getElementById("loginButton")?.addEventListener("click", login);

// Load user data on home page
async function loadUserData() {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById("playerName").textContent = userData.name;
            document.getElementById("synapsePoints").textContent = userData.synapsePoints;
            // Load additional stats as needed
        }
    }
}

// Run loadUserData on home page
if (window.location.pathname.includes("home.html")) {
    loadUserData();
}
