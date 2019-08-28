import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { isFunction } from 'src/modules/utils';
import { LOGIN_TOKEN_NAME } from 'src/modules/ENUM';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';

@ComponentEvent(Event)
class UploadFileComponent extends React.Component {
  constructor(props) {
    super(props);
    const { initialValue } = props.data;
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [...this.filterData(initialValue)],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { initialValue } = nextProps.data;
    initialValue &&
      initialValue.length &&
      this.setState({
        fileList: this.filterData(initialValue),
      });
  }

  filterData = (initialValue) => {
    const url = Array.isArray(initialValue) ? initialValue : initialValue ? [...initialValue] : [];
    const fileList = url.reduce((map, url, index) => {
      map.push({
        uid: index,
        status: 'done',
        url,
      });
      return map;
    }, []);
    return fileList;
  };

  handleFileRemoved = (_, index) => {
    const fileList = this.state.fileList.filter((_, i) => i !== index);
    this.setState({ fileList });
    const { keys, data, UploadCallback } = this.props;
    const key = keys || data.key;
    UploadCallback({ imageUrl: fileList.map((item) => item.url), key });
  };

  handleChange = (info) => {
    const { fileList: list, file } = info;
    const { keys, data, UploadCallback } = this.props;
    const key = keys || data.key;
    const fileList = [...list].pop();

    const stateFileList = [...this.state.fileList, ...fileList];
    const imageUrl = stateFileList.map((item) => (item.response ? item.response.data : item.url));

    if (!file.status || file.status === 'removed') {
      this.setState({ fileList: stateFileList });
      return UploadCallback({ imageUrl, key });
    }

    // const addIndex = stateFileList.findIndex((item) => !!item.response);
    const filterFile = fileList;
    const values = filterFile;

    if (values.response) {
      if (values.response.responseCode === '000') {
        const newfileList = stateFileList.reduce((c, i, index) => {
          const item = i.response
            ? {
                uid: index,
                status: 'done',
                url: i.response.data,
              }
            : i;
          return c.concat(item);
        }, []);
        // console.log('newfileList:', newfileList);
        this.setState({
          fileList: newfileList,
        });
        if (isFunction(UploadCallback)) {
          UploadCallback({ imageUrl, key });
        }
      } else {
        message.info('非常抱歉，上传失败了，请重新上传');
        this.setState({ fileList: this.state.fileList });
      }
    }
    //  else {
    //   this.setState({ fileList });
    // }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { label, data } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus-circle" theme="filled" />
        <div className="ant-upload-text">{label || data.label || '上传图片'}</div>
      </div>
    );
    const { uploadMax, fileAccept, listType } = data;
    const max = uploadMax || 1;
    const accept = fileAccept || 'image/*';
    const iconList = [
      {
        icon: 'eye',
        name: '预览',
        onClick: (file) => this.handlePreview(file),
      },
      {
        icon: 'download',
        name: '下载',
        onClick: ({ url }) => (window.location.href = url),
      },
      {
        icon: 'delete',
        name: '删除',
        onClick: (file, i) => this.handleFileRemoved(file, i),
      },
    ];
    const childrenIcon = (children, i) =>
      iconList.map((item, key) => (
        <span
          key={key}
          className="eju-flex eju-flex-column pointer"
          onClick={() => item.onClick(children, i)}
        >
          <Icon type={item.icon} />
          <span>{item.name}</span>
        </span>
      ));
    return (
      <div className="uploadFileComponent clearfix">
        {typeof data.title === 'function' ? (
          data.title()
        ) : (
          <div className="upload-title">{data.title}</div>
        )}
        {fileList.length >= max ? null : (
          <Upload
            accept={accept}
            headers={{ token: localStorage.getItem(LOGIN_TOKEN_NAME) }}
            action="/api/fileUpload"
            listType={listType || 'picture-card'}
            // fileList={fileList}
            showUploadList={false}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            name="file"
            beforeUpload={this.beforeUpload}
            supportServerRender={true}
          >
            <span>{uploadButton}</span>
          </Upload>
        )}
        <div className="ant-upload-list ant-upload-list-picture-card">
          {this.state.fileList.map((item, key) => {
            const title = this.RegExpExec(item.url, 'mateAfter');
            const childrenView = [];
            if (this.RegExpExec(item.url)) {
              childrenView.push(<div className="eju-flex-center">pdf</div>);
            } else if (this.RegExpExec(item.url, 'doc')) {
              childrenView.push(<div className="eju-flex-center">doc</div>);
            } else {
              childrenView.push(<img src={item.url} />);
            }
            return (
              <div
                className="ant-upload-list-item ant-upload-list-item-done"
                style={data.listItemStyle}
                title={title}
              >
                <div className="ant-upload-list-item-info">
                  <a className="ant-upload-list-item-thumbnail">{childrenView}</a>
                  <p className="file-name ellipsis-1line">{title}</p>
                </div>
                <div className="ant-upload-list-item-actions eju-icon">
                  {childrenIcon(item, key)}
                </div>
              </div>
            );
          })}
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadFileComponent;
