import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar";

function SingleChallenge({ teamData }) {
  const currentUserId = teamData.team_id;
  const [answers, setAnswers] = useState({});
  const [answeredMsg, setAnsweredMsg] = useState("");
  const location = useLocation();
  const { station } = location.state || {};
  const { station_id } = useParams();

  function handleInputChange(e, stationId) {
    setAnswers({
      ...answers,
      [stationId]: e.target.value,
    });
  }

  async function handleSubmitAnswer(stationId) {
    const userAnswer = answers[stationId]; //get the user's inputted answer from the state
    const stationRef = doc(db, "stations", stationId);
    const stationSnap = await getDoc(stationRef);

    if (stationSnap.exists()) {
      const correctAnswer = stationSnap.data().correct_answer;

      //if the answer is correct, add to the answers table
      if (userAnswer === correctAnswer) {
        const customStationId = stationSnap.data().station_id;
        //create a new document in the answers table
        await addDoc(collection(db, "answers"), {
          team_id: currentUserId,
          station_id: customStationId,
          points: stationSnap.data().points,
        });
        setAnsweredMsg("Correct answer! Station completed.");
      } else {
        setAnsweredMsg("Incorrect answer. Try again.");
      }
    }
  }
  if (!station) {
    return <div>no station found.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="single-station-container">
        <div className="single-station">
          <h2 className="single-station-name">{station.name}</h2>
          <h3>{station.desc}</h3>
          <div className="text-area">
            <input
              className="text-input"
              type="text"
              placeholder="Your answer"
              value={answers[station.id] || ""}
              onChange={(e) => handleInputChange(e, station.id)}
            />
          </div>
          <button
            className="submit"
            disabled={
              answeredMsg === "Correct answer! Station completed."
                ? true
                : false
            }
            onClick={() => handleSubmitAnswer(station.id)}
          >
            Submit
          </button>
          <p>{answeredMsg}</p>
        </div>
        <div className="back-button-container">
          <Link to={"/challenges"}>
            <button className="back-to-stations">Back to stations</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SingleChallenge;
