// import http from 'src/utils/http'
import { Message } from 'antd';

export default class Event {
  todoB = (data) => {
    Message.success('todo: ' + JSON.stringify(data));
    this.table && this.table.refresh();
  };

  batchTodo = () => {
    const keys = this.state.selectKeys.join(',');
    Message.success('batch todo: ' + keys);

    this.setState({
      selectKeys: [],
    });

    this.table && this.table.refresh();
  };

  append = () => {
    Message.success('append');
  };
}
