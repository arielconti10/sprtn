import React, {Component} from 'react';

import config from '../../../config';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span><a href={config.company.url} target="_blank">{config.company.name}</a> &copy; 2018</span>
        <span className="ml-auto">Powered by <a href={config.company.url}>{config.company.name}</a></span>
      </footer>
    )
  }
}

export default Footer;
