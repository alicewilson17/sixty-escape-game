import React, { useState } from "react";
import { signInAnonymously, setPersistence, browserLocalPersistence } from "firebase/auth";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login({ setTeamData }) {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      //query to search for the entered login details in the db
      const q = query(
        collection(db, "teams"),
        where("team_name", "==", teamName),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);
      //if entered login details exist in db, sign in, get the team data from Firestore and set it in the teamData state
      if (!querySnapshot.empty) {
        await signInAnonymously(auth);
        const teamData = querySnapshot.docs[0].data();
        setTeamData(teamData);
        console.log("Logged in successfully:", teamData);
      } else {
        setError("Invalid team name or passcode. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="login-container">
    <div className="login">
      <h1 className="login-title">Login</h1>
      <form className="form" onSubmit={handleLogin}>
        <div className="text-area">
          <input
            type="text"
            placeholder="Team name"
            value={teamName}
            className="text-input"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="text-area">
          <input
            type="text"
            placeholder="Passcode"
            value={password}
            className="text-input"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-btn">LOG IN</button>
      </form>
    </div>
      {error && <p className="login-error">{error}</p>}
      </div>
  );
}

export default Login;
