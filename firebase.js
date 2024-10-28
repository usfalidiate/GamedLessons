// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

// Form submission handler for registration/login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        // Try registering the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName: firstName,
            lastName: lastName,
            email: email,
            synapsePoints: 0,
            // Add other default stats here
        });

        window.location.href = "home.html";
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            // Email already exists, try logging in instead
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                window.location.href = "home.html";
            } catch (loginError) {
                console.error("Login error:", loginError);
                alert("Login failed: " + loginError.message);
            }
        } else {
            console.error("Registration error:", error);
            alert("Registration failed: " + error.message);
        }
    }
});
