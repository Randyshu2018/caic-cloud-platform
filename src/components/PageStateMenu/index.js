import './style.scss';
import React from 'react';
import { Layout, Steps } from 'antd';

class PageStateMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [
        {
          type: '1',
          title: '基础数据',
        },
        {
          type: '2',
          title: '资产诊断',
        },
        {
          type: '3',
          title: '运营诊断',
        },
        {
          type: '4',
          title: '价值诊断',
        },
        // {
        //   type: '5',
        //   title: '交易诊断',
        // },
      ],
    };
  }
  componentDidMount() {
    this.oldI = this.props.current - 1;
  }

  handleClick(i) {
    if (this.oldI === i) return null;
    this.oldI = i;
    // this.props.handlePageStateClick(i + 1);
  }

  render() {
    const current = Math.floor(this.props.current) || 0;
    return (
      <Layout className="pageMenu">
        <div className="pageMenu_container">
          <Steps current={current && current - 1}>
            {this.state.menuList.map(({ title, type }, index) => (
              <Steps.Step onClick={(_) => this.handleClick(index)} key={type} title={title} />
            ))}
          </Steps>
        </div>
      </Layout>
    );
  }
}

export default PageStateMenu;
