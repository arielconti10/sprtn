import React from 'react'

import {Link} from 'react-router'

export default function Shortcut() {
  return (
    <div id="shortcut">
      <ul>
        {/*<li>
          <Link to="/outlook" title="Inbox" className="jarvismetro-tile big-cubes bg-color-blue">
            <span className="iconbox"> <i className="fa fa-envelope fa-4x"/> <span>Mail <span
              className="label pull-right bg-color-darken">14</span></span> </span>
          </Link>
        </li>
        <li>
          <Link to="/calendar" className="jarvismetro-tile big-cubes bg-color-orangeDark"> <span className="iconbox"> <i
            className="fa fa-calendar fa-4x"/> <span>Calendar</span> </span> </Link>
        </li>
        <li>
          <Link to="/maps" className="jarvismetro-tile big-cubes bg-color-purple"> <span className="iconbox"> <i
            className="fa fa-map-marker fa-4x"/> <span>Maps</span> </span> </Link>
        </li>
        <li>
          <Link to="/misc/invoice" className="jarvismetro-tile big-cubes bg-color-blueDark"> <span className="iconbox"> <i
            className="fa fa-book fa-4x"/> <span>Invoice <span
            className="label pull-right bg-color-darken">99</span></span> </span> </Link>
        </li>*/}

        <li>
          <Link to="/logout" className="jarvismetro-tile big-cubes selected bg-color-pinkDark"> <span
            className="iconbox"> <i className="fa fa-user fa-4x"/> <span>Logout</span> </span> </Link>
        </li>
      </ul>
    </div>
  )
}
