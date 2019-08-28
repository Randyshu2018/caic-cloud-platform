import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col } from 'antd';
import { serviceIcon } from '../projectService';
import './ComboExhibition.scss';

class ComboExhibition extends Component {
  render() {
    const {
      project: { name: projectName, address, pkg },
    } = this.props;

    const { name: versionName, serviceList = [] } = pkg || {};

    return (
      <div>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>套餐总览</Breadcrumb.Item>
        </Breadcrumb>
        <section className="combo-exhibition">
          <header>
            <Row>
              <Col span={20}>
                <h1 className="project-name">
                  {projectName}
                  <span className="version-name">{versionName}</span>
                </h1>
                <div className="address">{address}</div>
              </Col>
              <Col span={4}>
                <div className="text-right">
                  {/*<Button htmlType="button" type="primary">
                    升级/续约
                  </Button>*/}
                </div>
              </Col>
            </Row>
          </header>
          <main className="combo-exhibition-main" style={{ minHeight: window.screen.height - 400 }}>
            <ul className="sign-project-service-list clearfix">
              {serviceList.map(({ code, name }) => (
                <li className="service-item text-center" key={code}>
                  <div className="header-icon">
                    <img src={serviceIcon[code]} alt={name} />
                  </div>
                  <div className="service-name">{name}</div>
                </li>
              ))}
            </ul>
          </main>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
  };
};

export default connect(mapStateToProps)(ComboExhibition);
