import React from 'react'
import {Link} from 'react-router-dom'

function NavBar() {
  return (
    <nav className='navbar'>
<div className="navbar-items">
                
                        <Link to = {"/"} className="navbar-link"><img className="icon" src="../../assets/icons/home.png"/><p className='icon-text'>Home</p></Link>
                    <Link to = {"/leaderboard"} className="navbar-link"><img className="icon" src="../../assets/icons/leaderboard.png"/><p className='icon-text'>Leaderboard</p></Link>
                    <Link to = {"/challenges"} className="navbar-link"><img className="icon" src="../../assets/icons/puzzle.png"/><p className='icon-text'>Stations</p></Link>
                   
                 
                 
            </div>
    </nav>

  )
}

export default NavBar