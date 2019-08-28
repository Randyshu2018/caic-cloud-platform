/**
 * Created by summer on 2018/11/23.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CircleErrorIcon extends Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    color: '#FA2242',
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
            <g id="任务详情" transform="translate(-310.000000, -396.000000)">
              <g id="项目" transform="translate(260.000000, 175.000000)">
                <g id="1" transform="translate(30.000000, 146.000000)">
                  <g id="Group-3" transform="translate(20.000000, 75.000000)">
                    <g id="删除">
                      <circle id="Oval-3" fill={color} cx="10" cy="10" r="10" />
                      <path
                        d="M9.30769231,9.30769231 L9.30769231,4 L10.6923077,4 L10.6923077,9.30769231 L16,9.30769231 L16,10.6923077 L10.6923077,10.6923077 L10.6923077,16 L9.30769231,16 L9.30769231,10.6923077 L4,10.6923077 L4,9.30769231 L9.30769231,9.30769231 Z"
                        id="Combined-Shape"
                        fill="#FFFFFF"
                        transform="translate(10.000000, 10.000000) rotate(45.000000) translate(-10.000000, -10.000000) "
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
