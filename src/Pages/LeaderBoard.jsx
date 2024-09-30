import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import React from "react";
import NavBar from "../Components/NavBar";

// //remember to update the security rules in production! in firestore:
// service cloud.firestore {
//     match /databases/{database}/documents {
//       match /teams/{teamId} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }

function LeaderBoard() {
  const [teams, setTeams] = useState([]);
  //getting most up to date team data//
  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("score", "desc")); // The query listens to changes in the teams collection, ordering them by score in descending order

    //onSnapshot ensures the leaderboard updates instantly whenever a team’s score changes.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })); //map to convert the Firestore documents into a usable array for react
      setTeams(teamsData); //update the teams state with the updated data
    });
    return () => unsubscribe(); //cleanup listener on unmount
  }, []);

  //update team score - call this when a team correctly answers a puzzle//
  const updateTeamScore = async (teamId, points) => {
    try {
      // Reference the team's document in Firestore
      const teamRef = doc(db, "teams", teamId);

      // Get the team's current data (including the score)
      const teamSnap = await getDoc(teamRef);

      if (teamSnap.exists()) {
        const currentScore = teamSnap.data().score;

        // Update the score by adding/subtracting the points
        const newScore = currentScore + points;

        // Update the document with the new score
        await updateDoc(teamRef, {
          score: newScore,
        });

        console.log(`Updated team ${teamId} score to: ${newScore}`);
      } else {
        console.log("Team doesn't exist");
      }
    } catch (error) {
      console.error("Error updating score: ", error);
    }
  };

  return (
    <>
    <NavBar/>
      <h1>LeaderBoard</h1>   
      <div className="leaderboard">
        {teams.map((team) => {
          return (
            <div key={team.id} className="team">
              <span>{team.team_name}</span>
              <span>{team.score} points</span>
              <button
                onClick={() => {
                  updateTeamScore(team.id, 3);
                }}
              >
                {" "}
                Add 3 points{" "}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}


export default LeaderBoard;
