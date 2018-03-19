/**
 * Created by griga on 11/17/15.
 */

import React from 'react'

import FullScreen from './FullScreen'
import ToggleMenu from './ToggleMenu'

export default class Header extends React.Component {
    render() {
		return <header id="header">
			<div id="logo-group">
					<span id="logo">
						<img src="assets/img/logo-spartan.png" // place your logo here
							alt="Spartan"/>
					</span>
			{/* Note: The activity badge color changes when clicked and resets the number to 0
			Suggestion: You may want to set a flag when this happens to tick off all checked messages / notifications */}

		</div>

		<div className="pull-right"  /*pulled right: nav area*/ >

			<ToggleMenu className="btn-header pull-right"  /* collapse menu button */ />

			{/* logout button */}
			<div id="logout" className="btn-header transparent pull-right">
						<span> <a href="#/login" title="Sign Out"
								data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i
								className="fa fa-sign-out"/></a> </span>
			</div>
			
			{/* input: search field */}
			<form action="#/misc/search.html" className="header-search pull-right">
				<input id="search-fld" type="text" name="param" placeholder="Find reports and more"
					data-autocomplete='[
							"ActionScript",
							"AppleScript",
							"Asp",
							"BASIC",
							"C",
							"C++",
							"Clojure",
							"COBOL",
							"ColdFusion",
							"Erlang",
							"Fortran",
							"Groovy",
							"Haskell",
							"Java",
							"JavaScript",
							"Lisp",
							"Perl",
							"PHP",
							"Python",
							"Ruby",
							"Scala",
							"Scheme"]'/>
				<button type="submit">
					<i className="fa fa-search"/>
				</button>
				<a href="$" id="cancel-search-js" title="Cancel Search"><i className="fa fa-times"/></a>
			</form>

			<FullScreen className="btn-header transparent pull-right"/>   

		</div>
		{/* end pulled right: nav area */}

		</header>
    }
}