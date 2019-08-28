import React from 'react';
import './style.scss'

export default class Legislation extends React.PureComponent {
  render() {
    return (
      <div className="legislation-container">
        <p>
          <a href="//www.beian.miit.gov.cn" target="__blank">©{(new Date()).getFullYear()} 沪ICP备19019794号-1</a>
        </p>
      </div>
    )
  }
}