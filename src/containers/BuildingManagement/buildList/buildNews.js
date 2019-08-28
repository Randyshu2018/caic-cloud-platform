import React from 'react';
// import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import '../style/index.scss';
import api from 'api';
// import { observer, inject } from 'mobx-react'
import help from '../img/help.png';
const NewsTitle = ({ news }) => (
  <Tooltip title={news}>
    <img src={help} alt="" />
  </Tooltip>
);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    window.getBuildNewsData = this.getData;
  }
  state = {
    news: {},
  };
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    const { projectId } = this.props;
    // console.log(projectId)
    api.buildingTotalStatis({ projectId }).then((res) => {
      this.setState({ news: res || {} });
    });
  };
  render() {
    const { news } = this.state;
    return (
      <React.Fragment>
        <ul className="build-manage-builds-news">
          <li>
            <section>
              管理面积
              <NewsTitle news="在系统中录入的房源面积的总和" />
            </section>
            <p>{news.mgtArea || '--'}㎡</p>
            <span>总房源数量：{news.totalRoomNum || '--'}间</span>
          </li>
          <li>
            <section>
              出租率
              <NewsTitle news="出租率：当前出租面积占总房源面积的百分比" />
            </section>
            <p>{news.rentalRate || '--'}%</p>
            <span>本月出租面积：{news.monthRentedArea || '--'}㎡</span>
          </li>
          <li>
            <section>
              在租实时均价
              <NewsTitle news="在租实时均价：当前租户均价合计/租户数；本月签约均价：本月出租均价合计/本月签约租户数" />
            </section>
            <p>{news.avgPrice || '--'}/㎡.天</p>
            <span>本月签约均价：{news.monthAvgPrice || '--'}元/㎡.天</span>
          </li>
          <li>
            <section>
              在租合同数
              <NewsTitle news="在租合同数：在租合同总数" />
            </section>
            <p>{news.rentedContractNum || '--'}份</p>
            <span>本月新签合同数：{news.monthRentedContractNum || '--'}</span>
          </li>
          <li>
            <section>
              已出租面积
              <NewsTitle news="已出租面积：在系统中记录已出租面积的总和" />
            </section>
            <p>{news.rentedArea || '--'}㎡</p>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}
