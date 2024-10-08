import React from 'react'
import {Link} from 'react-router-dom'

function NavBar({className}) {
  return (
    <nav className={`navbar ${className}`}>
<div className="navbar-items">
                
                        <Link to = {"/"} className="navbar-link"><img className="icon" src="../../assets/icons/home.png" alt="home"/><p className='icon-text'>Home</p></Link>
                    <Link to = {"/leaderboard"} className="navbar-link"><img className="icon" src="../../assets/icons/leaderboard.png" alt="leaderboard"/><p className='icon-text'>Leaderboard</p></Link>
                    <Link to = {"/challenges"} className="navbar-link"><img className="icon" src="../../assets/icons/puzzle.png" alt="puzzle"/><p className='icon-text'>Stations</p></Link>
                   
                 
                 
            </div>
    </nav>

  )
}

export default NavBar