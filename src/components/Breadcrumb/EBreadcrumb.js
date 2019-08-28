import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import './Breadcrumb.scss';

class EBreadcrumb extends Component {
  static propTypes = {
    breadData: PropTypes.array.isRequired,
  };

  render() {
    const { breadData } = this.props;

    return (
      <div className="breadContainer">
        <Breadcrumb separator=">" className="breadcrumb">
          {breadData.map(
            (item, index) =>
              index === breadData.length - 1 ? (
                <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
              ) : (
                <Breadcrumb.Item key={index}>
                  <Link to={item.path}>{item.name}</Link>
                </Breadcrumb.Item>
              )
          )}
        </Breadcrumb>
      </div>
    );
  }
}

export default EBreadcrumb;
