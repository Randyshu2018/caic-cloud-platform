import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { isFunction } from 'src/modules/utils';
import { LOGIN_TOKEN_NAME } from 'src/modules/ENUM';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';
import { Consumer } from 'src/context/index';

@Consumer
@ComponentEvent(Event)
class UploadFileComponent extends React.Component {
  constructor(props) {
    super(props);
    const url = props.data.initialValue;
    const fileList = url
      ? [
          {
            uid: '-1',
            status: 'done',
            url,
          },
        ]
      : [];

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    };
  }

  componentDidMount() {
    // console.log('upload:', this.props);
  }

  handleChange = (info) => {
    const { fileList, file } = info;
    const { keys, data, UploadCallback, $handleRecognition } = this.props;
    const key = keys || data.key;
    if (!file.status || file.status === 'removed') {
      this.setState({ fileList });
      return UploadCallback({ imageUrl: '', key });
    }
    const values = fileList[0];
    if (values.response) {
      if (values.response.responseCode === '000') {
        this.setState({ fileList });
        const query = { imageUrl: encodeURI(values.response.data), key };
        if (isFunction(UploadCallback)) {
          UploadCallback(query);
        }
        isFunction($handleRecognition) && $handleRecognition(query, this.props.form);
      } else {
        message.info('非常抱歉，上传失败了，请重新上传');
        this.setState({ fileList: [] });
      }
    } else {
      this.setState({ fileList });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    // console.log(this.props);
    const { label, data, style = {} } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus-circle" theme="filled" />
        <div className="ant-upload-text">{label || data.label || '上传图片'}</div>
      </div>
    );
    const { uploadMax, fileAccept } = data;
    const max = uploadMax || 1;
    const accept = fileAccept || 'image/*';
    return (
      <div className="uploadFileComponent clearfix" style={{ ...style }}>
        {typeof data.title === 'function' ? (
          data.title()
        ) : (
          <div className="upload-title">{data.title}</div>
        )}
        <Upload
          accept={accept}
          headers={{ token: localStorage.getItem(LOGIN_TOKEN_NAME) }}
          action="/api/fileUpload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name="file"
          beforeUpload={this.beforeUpload}
          supportServerRender={true}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadFileComponent;
