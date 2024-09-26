import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'

function Challenges() {

//on click remaining button, set remaining button style to pressed style and get all puzzles with status 'remaining' and display them
//on click completed button, set completed button style to pressed style and get all puzzles with status 'completed' and display them

const [statusToggle, setStatusToggle] = useState('remaining')
const [remainingPuzzles, setRemainingPuzzles] = useState([])
const [completedPuzzles, setCompletedPuzzles] = useState([])


useEffect(() => {
    //queries
    const qRemaining = query(collection(db, 'puzzles'), where('status', "==", 'remaining'))
    const qCompleted = query(collection(db, 'puzzles'), where('status', "==", 'completed'))
    
    const unsubscribeRemaining = onSnapshot(qRemaining, (snapshot) => {
        const remainingPuzzlesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setRemainingPuzzles(remainingPuzzlesData)
    })
    const unsubscribeCompleted = onSnapshot(qCompleted, (snapshot) => {
        const completedPuzzlesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setCompletedPuzzles(completedPuzzlesData)
    })
return () => {
    unsubscribeRemaining()
    unsubscribeCompleted()
}
}, [])

async function completePuzzle(id) {
const puzzleRef = doc(db, 'puzzles', id)
await updateDoc(puzzleRef, {
    status: 'completed'
})
console.log('Puzzle completed!')
}

  return (
    <div className='challenges'><h1>Challenges</h1>
    <div className='challenges-toggle'>
        <button className={statusToggle === 'remaining' ? 'status-button-active' : 'status-button-inactive'} onClick={() => {
            setStatusToggle('remaining')}
            }>Remaining</button>
        <button className={statusToggle === 'completed' ? 'status-button-active' : 'status-button-inactive'} onClick={() => setStatusToggle('completed')}>Completed</button>
        </div>
        {statusToggle === 'remaining' && <div className='puzzles'>
            <h2>Remaining Puzzles</h2>
            {remainingPuzzles.map(puzzle => (<div key={puzzle.id} className='puzzle'><h3>{puzzle.puzzle_name}</h3><button onClick={() => completePuzzle(puzzle.id)}>Submit answer</button></div>))}
            </div>}
        {statusToggle === 'completed' && <div className='puzzles'>
            <h2>Completed puzzles</h2>
            {completedPuzzles.map(puzzle => (<div key={puzzle.id} className='puzzle'><h3>{puzzle.puzzle_name}</h3></div>))}
            </div>}
    </div>
    
   
  )
}

export default Challenges