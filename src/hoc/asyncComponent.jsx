// 异步加载组建
// 使用方式：
// import AsyncComponent from 'src/hoc/asyncComponent'
// const SomeAsyncComponent = AsyncComponent(e => import('src/xxx/xxx'))

import React, { PureComponent } from 'react';

const AsyncComponent = (comp) => {
  class Comp extends PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        Component: null,
      };
    }

    componentWillMount() {
      // // 如果token没有，重新登录
      // if(!getToken()){
      // 	history.replaceState(null, '', '/system/login')
      // 	location.reload()
      // 	return
      // }

      if (this.hasLoadedComponent()) {
        return;
      }

      comp()
        .then((module) => module.default)
        .then((Component) => {
          this.setState({ Component });
        })
        .catch((err) => {
          console.error(`Cannot load component in <AsyncComponent />`);
          throw err;
        });
    }

    hasLoadedComponent() {
      return this.state.Component !== null;
    }

    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : null;
    }
  }

  Comp.displayName = `AsyncComponent`;
  return Comp;
};

export default AsyncComponent;
