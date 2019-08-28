class event {
  handleLink(query) {
    this.props.history.push(`/create-project/flow/${query}`);
  }
}
export default new event();
