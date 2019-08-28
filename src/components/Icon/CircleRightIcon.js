/**
 * Created by summer on 2018/11/23.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CircleRightIcon extends Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    color: '#50E3C2',
    className: '',
    width: 20,
    height: 20,
    style: {
      marginRight: '10px',
      height: '20px',
    },
  };

  render() {
    const { color, width, height, style, className } = this.props;
    return (
      <span className={className} style={style}>
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="任务详情" transform="translate(-591.000000, -396.000000)">
              <g id="项目" transform="translate(260.000000, 175.000000)">
                <g id="2" transform="translate(311.000000, 146.000000)">
                  <g id="Group-4" transform="translate(20.000000, 75.000000)">
                    <g id="对号">
                      <circle id="Oval-3" fill={color} cx="10" cy="10" r="10" />
                      <polygon
                        id="Shape"
                        stroke="#FFFFFF"
                        strokeWidth="0.2"
                        fill="#FFFFFF"
                        fillRule="nonzero"
                        points="15.0323905 6 8.25775547 13.0003143 4.96760949 9.60056568 4 10.6004085 7.29014599 14.0001571 8.25775547 15 9.22536496 14.0001571 16 6.99984287"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </span>
    );
  }
}
