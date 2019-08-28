import React from 'react';
import { Tooltip, Button, Pagination } from 'antd';
import { events } from './index';
export const Paging = ({ current, total, onChange }) => {
  return (
    <React.Fragment>
      {total > 10 && (
        <div className="text-center pt-50 pb-50">
          <Pagination current={current} total={total} onChange={onChange} />
        </div>
      )}
    </React.Fragment>
  );
};
export class EventsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.handle();
  }
  handle = (type) => {
    const { listener = {} } = this.props;
    const arr = Object.entries(listener);
    if (!arr.length) {
      arr.forEach((v) => {
        events[type || 'on'](v[0], v[1]);
      });
    }
  };
  componentWillUnmount() {
    this.handle('removeListener');
  }
  render() {
    return this.props.children;
  }
}
