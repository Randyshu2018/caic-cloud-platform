import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Body from 'src/routes/components/body';
import { Layout } from 'antd';
import { TopHeader } from 'src/components/Layout/index';

export default class Router extends Component {
  render() {
    const { path, childer, currentKey, layout = 'rightScreen' } = this.props;
    return (
      <Route
        key={path}
        path={path}
        render={({ match: { url } }) => {
          const renderChildren = (
            <Switch>
              {childer.map(({ path, component, exact }) => (
                <Route
                  path={`${url}${path}`}
                  component={component}
                  key={path}
                  exact={exact !== false}
                />
              ))}
            </Switch>
          );
          const renderType = {
            rightScreen: () => {
              return <Body currentKey={currentKey}>{renderChildren}</Body>;
            },
            fullScreen: () => {
              return (
                <Layout>
                  <TopHeader />
                  <Layout.Content>{renderChildren}</Layout.Content>
                </Layout>
              );
            },
          };
          return renderType.hasOwnProperty(layout) ? renderType[layout]() : null;
        }}
      />
    );
  }
}
