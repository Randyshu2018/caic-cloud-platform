import React from 'react';
import '../style/index.scss';
import { Tooltip } from 'antd';
import help from '../img/help.png';

const NewsTitle = ({ news }) => (
  <Tooltip title={news}>
    <img src={help} alt="" />
  </Tooltip>
);
export class App extends React.Component {
  render() {
    const { building } = this.props;
    const { attachFile } = building;
    return (
      <React.Fragment>
        <div className="build-manage-hasbuild-top">
          <img src={attachFile} alt="暂时没有图片" />
          <div>
            <ul className="build-manage-builds-news">
              <li>
                <section>
                  管理面积
                  <NewsTitle news="在系统中录入的房源面积的总和" />
                </section>
                <p>{building.mgtArea || '--'}㎡</p>
                <span>总房源数量：{building.totalRoomNum || '--'}间</span>
              </li>
              <li>
                <section>
                  出租率
                  <NewsTitle news="出租率：当前出租面积占总房源面积的百分比" />
                </section>
                <p>{building.rentalRate || '--'}%</p>
                <span>本月出租面积：{building.monthRentedArea || '--'}㎡</span>
              </li>
              <li>
                <section>
                  在租实时均价
                  <NewsTitle news="在租实时均价：当前租户均价合计/租户数；本月签约均价：本月出租均价合计/本月签约租户数" />
                </section>
                <p>{building.avgPrice || '--'}/㎡.天</p>
                <span>本月签约均价：{building.monthAvgPrice || '--'}元/㎡.天</span>
              </li>
              <li>
                <section>
                  在租合同数
                  <NewsTitle news="在租合同数：在租合同总数；" />
                </section>
                <p>{building.rentedContractNum || '--'}份</p>
                <span>本月新签合同数：{building.monthRentedContractNum || '--'}</span>
              </li>
              <li>
                <section>
                  已出租面积
                  <NewsTitle news="已出租面积：在系统中记录已出租面积的总和" />
                </section>
                <p>{building.rentedArea || '--'}㎡</p>
                <span> {''}</span>
              </li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default App;
