import React, { Component } from 'react';

export default class SuccessIcon extends Component {
  render() {
    const { style = {}, className = '' } = this.props;
    return (
      <span className={className} style={style}>
        <svg
          width="44px"
          height="44px"
          viewBox="0 0 44 44"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g
              id="返回支付结果"
              transform="translate(-597.000000, -468.000000)"
              fill="#46E5C2"
              fillRule="nonzero"
            >
              <g id="成功" transform="translate(596.000000, 468.000000)">
                <path
                  d="M23,44 C10.8497355,44 1,34.1502645 1,22 C1,9.8497355 10.8497355,2.23196738e-15 23,0 C35.1502645,7.43989126e-16 45,9.8497355 45,22 C45,34.1502645 35.1502645,44 23,44 Z M20.0386428,27.3315356 L14.2471428,21.4706071 L10.4285714,25.1184999 C13.2057143,26.614107 17.0966071,29.3420713 20.4291785,33.5714284 C22.7839642,29.145357 30.0421427,20.0907142 33.5714284,19.2807142 C33.0015356,16.9982499 32.6804284,12.7139285 33.5714284,10.4285714 C26.3334999,15.2017856 20.0386428,27.3315356 20.0386428,27.3315356 Z"
                  id="形状"
                />
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  }
}
