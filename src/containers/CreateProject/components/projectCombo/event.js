export default class Event {
  handleCheckBoxChange = (e) => {   
    this.setState({
      isAccredis: e.target.checked
    })
  };
}
