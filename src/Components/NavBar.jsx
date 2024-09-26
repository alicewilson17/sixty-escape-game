import React from 'react'
import {Link} from 'react-router-dom'

function NavBar() {
  return (
    <nav className='navbar'>
<div className="navbar-items">
                <ul>
                    <li>
                        <Link to = {"/"} className="navbar-link">mission</Link>
                    </li>
                    <li>
                    <Link to = {"/challenges"} className="navbar-link">challenges</Link>
                    </li>
                    <li>
                    <Link to = {"/leaderboard"} className="navbar-link">leaderboard</Link>
                    </li>
                </ul>
            </div>
    </nav>

  )
}

export default NavBar