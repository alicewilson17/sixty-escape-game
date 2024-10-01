import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import React from "react";
import NavBar from "../Components/NavBar";

function LeaderBoard({ teamData }) {
  const currentUserId = teamData.team_id;
  const [leaderboard, setLeaderboard] = useState([]);

  //fetch all data from answers table and sum up the points for each team
  async function getTeamPoints() {
    try {
      const answersRef = collection(db, "answers");
      const answersQuery = query(answersRef);
      const answersSnapshot = await getDocs(answersQuery);

      const answers = answersSnapshot.docs.map((answer) => answer.data());

      const pointsPerTeam = answers.reduce((acc, currentAnswerEntry) => {
        const { team_id, points } = currentAnswerEntry;
        // If the team_id doesn't exist yet in the accumulator object, initialize it to 0
        if (!acc[team_id]) {
          acc[team_id] = 0;
        }
        // Add the current answer entry's points to the team's accumulated total
        acc[team_id] += points;
        return acc;
      }, {});
      return pointsPerTeam;
    } catch (error) {
      console.log(error);
    }
  }

  //get teams data
  async function fetchTeams() {
    try {
        const teamsRef = collection(db, "teams");
        const teamsQuery = query(teamsRef);
        const teamsSnapshot = await getDocs(teamsQuery);
        const teams = teamsSnapshot.docs.map((team) => team.data());
        return teams;
    } catch (error) {
      console.log(error);
    }
  }

  //combine the points by team from answers table and the team name from teams table to create leaderboard array, and sort by highest to lowest points
  async function getLeaderboard() {
    try {
      const pointsByTeam = await getTeamPoints();
    const teamsData = await fetchTeams();
    const leaderboard = teamsData.map((team) => ({
      team_name: team.team_name,
      points: pointsByTeam[team.team_id] || 0
    }))
    const orderedLeaderboard = leaderboard.sort((a, b) => b.points - a.points)
    return orderedLeaderboard
  }
  catch(error) {
    console.log(error)
  }
}

  useEffect(() => {
    async function fetchLeaderboard() {
      const lb = await getLeaderboard()
      setLeaderboard(lb)
    }
    fetchLeaderboard()
  }, []);

  return (
    <>
      <NavBar />
      <h1>LeaderBoard</h1>
      <div className="leaderboard">
        {leaderboard.map((team, index) => {
          return (
            <div key={index} className="team">
              <span>{team.team_name}</span>
              <span>{team.points} points</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default LeaderBoard;
