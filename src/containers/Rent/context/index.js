import React from 'react';
const ContextComponent = React.createContext();
export function Consumer(Component) {
  return (props) => {
    return (
      <ContextComponent.Consumer>
        {(params) => <Component {...props} {...params} />}
      </ContextComponent.Consumer>
    );
  };
}
export { ContextComponent };
