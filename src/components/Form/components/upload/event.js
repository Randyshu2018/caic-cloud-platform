import { message } from 'antd';

export default class Event {
  beforeUpload = (file) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const isImgType = this.props.data.fileType || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpg',
      ];
      const isUp = isImgType.indexOf(file.type) < 0;
      if (isUp) {
        message.warning(`文件格式只能为${isImgType.join(',')}，当前文件类型为${file.type}`, 5);
      }
      const maxSize = 4;
      const size = file.size / 1024 / 1024;
      const isLt5M = size > maxSize;
      if (!isUp && isLt5M) {
        message.warning(
          `文件大小不能超过${maxSize}M，当前文件大小${size.toFixed(2)}M，已超出${(
            size - maxSize
          ).toFixed(2)}M`,
          5
        );
        return reject();
      }
      if (!isUp && !isLt5M) resolve(file);
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  RegExpExec = (str, r) => {
    const types = {
      doc: /\.(doc|docx)$/,
      pdf: /\.(pdf)$/,
      mateAfter: /[^/]+$/g,
    };
    return types[r || 'pdf'].exec(str);
  };

  handlePreview = (file) => {
    const url = file.url || file.thumbUrl;
    if (this.RegExpExec(url)) {
      const href = encodeURI(`/#/preview?fileUrl=${url}`);
      window.open(href);
      return;
    } else if (this.RegExpExec(url, 'doc')) {
      const href = encodeURI(`https://view.officeapps.live.com/op/view.aspx?src=${url}`);
      window.open(href);
      return;
    }
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  };
}
