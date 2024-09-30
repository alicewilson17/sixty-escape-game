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
  addDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import NavBar from "../Components/NavBar";

function Challenges({ teamData }) {
  const [statusToggle, setStatusToggle] = useState("remaining");
  const [remainingStations, setRemainingStations] = useState([]);
  const [completedStations, setCompletedStations] = useState([]);
  const [answers, setAnswers] = useState({});
  const currentUserId = teamData.team_id;


  async function fetchStations() {
    const answersRef = collection(db, "answers");
    const answerQuery = query(
      answersRef,
      where("team_id", "==", currentUserId)
    );

    //listen for real-time updates to the answers collection
    return onSnapshot(answerQuery, async (answerSnapshot) => {
             const answeredStationIds = answerSnapshot.docs.map(
               (doc) => doc.data().station_id
             );

       
             //fetch the remaining and completed stations based on the answered stations
             const remainingStationsDb = await getRemainingStations(
               answeredStationIds
             );
             const completedStationsDb = await getCompletedStations(
               answeredStationIds
             );


       
             setRemainingStations(remainingStationsDb);
             setCompletedStations(completedStationsDb);
   })
  }

  
  useEffect(() => {
    const unsubscribe = fetchStations(); //Calling fetchStations inside useEffect to fetch data on component mount
    return () => {
        unsubscribe() //clean up the listener on unmount
    }
}, [currentUserId]);

  async function getRemainingStations(answeredStationIds) {
    //if there are no completed stations, fetch all stations
    if (answeredStationIds.length === 0) {
      const remainingQuery = query(collection(db, "stations"));
      const snapshot = await getDocs(remainingQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      //if there are completed stations, fetch only the remaining stations

      const remainingQuery = query(
        collection(db, "stations"),
        where("station_id", "not-in", answeredStationIds)
      );
      const snapshot = await getDocs(remainingQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  }

  async function getCompletedStations(answeredStationIds) {

    //if no stations are completed yet, return empty array
    if (answeredStationIds.length === 0) {
      return [];
    } else {
      const completedQuery = query(
        collection(db, "stations"),
        where("station_id", "in", answeredStationIds)
      );
      const snapshot = await getDocs(completedQuery);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  }

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
        const customStationId = stationSnap.data().station_id
        //create a new document in the answers table
        await addDoc(collection(db, "answers"), {
          team_id: currentUserId,
          station_id: customStationId,
          points: stationSnap.data().points,
        });
        console.log("Correct answer. Station completed!");
      } else {
        console.log("Incorrect answer. Try again.");
      }
    }
  }

  return (
    <div className="challenges">
      <NavBar />
      <h1>Stations</h1>
      <div className="challenges-toggle">
        <button
          className={
            statusToggle === "remaining"
              ? "status-button-active"
              : "status-button-inactive"
          }
          onClick={() => {
            setStatusToggle("remaining");
          }}
        >
          Remaining
        </button>
        <button
          className={
            statusToggle === "completed"
              ? "status-button-active"
              : "status-button-inactive"
          }
          onClick={() => setStatusToggle("completed")}
        >
          Completed
        </button>
      </div>
      {statusToggle === "remaining" && (
        <div className="stations">
          <h2>Remaining Stations</h2>
          {remainingStations.map((station) => (
            <div key={station.id} className="station">
              <h3>{station.name}, {station.station_id}</h3>
              <input
                type="text"
                placeholder="Your answer"
                value={answers[station.id] || ""}
                onChange={(e) => handleInputChange(e, station.id)}
              />
              <button onClick={() => handleSubmitAnswer(station.id)}>
                Submit
              </button>
            </div>
          ))}
        </div>
      )}
      {statusToggle === "completed" && (
        <div className="stations">
          <h2>Completed Stations</h2>
          {completedStations.map((station) => (
            <div key={station.id} className="station">
              <h3>{station.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Challenges;
