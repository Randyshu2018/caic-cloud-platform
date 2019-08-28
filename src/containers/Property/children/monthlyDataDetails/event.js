import { message } from 'antd';

export default class Event {
  onFormRefsCallBack = (formRefs) => {
    // this.timeFormRefs && (clearInterval(this.timeFormRefs));
    // if (formRefs) {
    //   this.timeFormRefs = setInterval(() => {
    //     console.log(formRefs.getFieldsValue());
    //   }, 10000)
    // }
  };

  handleCochainOk = () => {
    this.fetchUp2Chain();
  };

  handleUpPageDetails = () => {
    const { replace, taskId, url } = this.query;
    taskId || replace(`${url}?taskId=${this.taskId}`);
  };

  onUploadCallback = (taskId) => {
    this.taskId = taskId;
    this.handleUpPageDetails();
    this.setState({ isLoading: true }, this.fetchConfigData);
    this.hideModel();
  };

  Up2ChainSuccess = () => {
    const {
      state: {
        breadData: [{ path }],
      },
      query: { replace, year },
    } = this;
    replace(`${path}?year=${year}`);
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.hideModel();
  };

  handleUpload = () => {
    this.showModel();
  };

  showModel = () => {
    this.setState({ visibleUpload: true });
  };

  hideModel = () => {
    this.setState({ visibleUpload: false, visible: false });
  };
  handleSubmit = () => {
    const {
      query: { taskId = this.taskId },
    } = this;
    if (!taskId) return message.info('请先保存表单信息');
    this.setState({ visible: true });
  };
}
