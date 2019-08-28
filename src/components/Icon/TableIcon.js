/**
 * Created by summer on 2018/11/22.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TableIcon extends Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    color: '#FFFFFF',
    className: '',
    width: 16,
    height: 16,
    style: {
      marginRight: '5px',
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
          style={{ verticalAlign: 'middle' }}
        >
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g
              id="任务详情-分析并上链"
              transform="translate(-1286.000000, -230.000000)"
              fill={color}
              fillRule="nonzero"
            >
              <g id="项目" transform="translate(260.000000, 191.000000)">
                <g id="导入表格" transform="translate(1010.000000, 30.000000)">
                  <g id="Group-2" transform="translate(16.000000, 9.000000)">
                    <g id="链接">
                      <path
                        d="M9.19047619,9.85714286 L5.14285714,5.80952381 C4.95238095,5.61904762 4.95238095,5.33333333 5.14285714,5.14285714 C5.33333333,4.95238095 5.61904762,4.95238095 5.80952381,5.14285714 L9.85714286,9.19047619 C10.047619,9.38095238 10.047619,9.66666667 9.85714286,9.85714286 C9.66666667,10.047619 9.38095238,10.047619 9.19047619,9.85714286 Z"
                        id="Shape"
                      />
                      <path
                        d="M6.29508197,8.15686275 C6.13770492,8 5.87540984,7.94771242 5.71803279,8.05228758 C5.14098361,8.31372549 4.40655738,8.20915033 3.93442623,7.73856209 L1.52131148,5.33333333 C0.891803279,4.70588235 0.891803279,3.7124183 1.52131148,3.1372549 L3.14754098,1.51633987 C3.77704918,0.888888889 4.77377049,0.888888889 5.35081967,1.51633987 L7.76393443,3.92156863 C8.23606557,4.39215686 8.34098361,5.12418301 8.07868852,5.69934641 C7.97377049,5.90849673 7.97377049,6.16993464 8.18360656,6.32679739 C8.44590164,6.58823529 8.86557377,6.48366013 9.02295082,6.16993464 C9.49508197,5.17647059 9.33770492,3.97385621 8.55081967,3.1372549 L6.0852459,0.784313725 C5.03606557,-0.261437908 3.40983607,-0.261437908 2.36065574,0.784313725 L0.786885246,2.40522876 C-0.262295082,3.45098039 -0.262295082,5.07189542 0.786885246,6.11764706 L3.2,8.52287582 C3.98688525,9.30718954 5.19344262,9.46405229 6.19016393,9.04575163 C6.45245902,8.83660131 6.55737705,8.41830065 6.29508197,8.15686275 Z M9.70491803,7.79084967 C9.86229508,7.94771242 10.1245902,8 10.2819672,7.89542484 C10.8590164,7.63398693 11.5934426,7.73856209 12.0655738,8.20915033 L14.4786885,10.6143791 C15.1081967,11.2418301 15.1081967,12.2352941 14.4786885,12.8104575 L12.852459,14.4313725 C12.2229508,15.0588235 11.2262295,15.0588235 10.6491803,14.4313725 L8.23606557,12.0261438 C7.76393443,11.5555556 7.65901639,10.8235294 7.92131148,10.248366 C8.02622951,10.0392157 8.02622951,9.77777778 7.81639344,9.62091503 C7.55409836,9.35947712 7.13442623,9.46405229 6.97704918,9.77777778 C6.50491803,10.7712418 6.66229508,11.9738562 7.44918033,12.8104575 L9.86229508,15.2156863 C10.9114754,16.2614379 12.5377049,16.2614379 13.5868852,15.2156863 L15.2131148,13.5947712 C16.2622951,12.5490196 16.2622951,10.9281046 15.2131148,9.88235294 L12.8,7.47712418 C12.0131148,6.69281046 10.8065574,6.53594771 9.80983607,6.95424837 C9.54754098,7.11111111 9.44262295,7.52941176 9.70491803,7.79084967 Z"
                        id="Shape"
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
