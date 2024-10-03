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
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";

function Challenges({ teamData, isGameInProgress }) {
  const [statusToggle, setStatusToggle] = useState("remaining");
  const [remainingStations, setRemainingStations] = useState([]);
  const [completedStations, setCompletedStations] = useState([]);

  const currentUserId = teamData.team_id;

  useEffect(() => {
    const answersRef = collection(db, "answers");
    const answerQuery = query(
      answersRef,
      where("team_id", "==", currentUserId)
    );

    //listen for real-time updates to the answers collection
  const unsubscribe = onSnapshot(answerQuery, async (answerSnapshot) => {
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
    });
    return () => {
      unsubscribe(); //clean up the listener on unmount
    };
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
return (
<div className="challenges">
      <NavBar />
      <h1>Stations</h1>
      {isGameInProgress ? (
        <>
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
          <p className="remaining-stations-instructions">Tap a station to input your answer.</p>
          {remainingStations.map((station) => (
            <Link to={`/challenges/${station.station_id}`} key={station.id} state={{ station }}>
              <button key={station.id} className="module">
                <h3>{station.name}</h3>  <p>{station.desc}</p>
             </button>
              </Link>
          ))} 
        </div>
      )}
      {statusToggle === "completed" && (
        <div className="stations">
          <h2>Completed Stations</h2>
          {completedStations.map((station) => (
            <div key={station.id} className="module">
              <h3>{station.name}</h3> <p>{station.desc}</p>
            </div>
          ))}
        </div>
      )}
      </>
    ) : (
       <p>The mission is not currently in progress. Check back later.</p>
      )}
    </div>)

}

export default Challenges;
