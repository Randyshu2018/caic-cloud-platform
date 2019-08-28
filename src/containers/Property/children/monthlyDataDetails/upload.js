import React, { Component } from 'react';
import { message, Modal, Alert, Upload, Button, Icon } from 'antd';
import { EXCEL_ACCEPT, LOGIN_TOKEN_NAME } from 'src/modules/ENUM';

export default class component extends Component {
  state = {
    confirmLoading: false,
    fileList: [],
    done: false,
    uploadError: '',
  };

  submitUpload = async ({ host, form }) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', (e) => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject();
          message.error('导入失败');
        }
      });
      xhr.open('post', host);
      xhr.setRequestHeader('token', localStorage.getItem(LOGIN_TOKEN_NAME));
      xhr.send(form);
    });
  };

  upload = () => {
    this.setState({ confirmLoading: true });

    const {
      fileList: [file],
    } = this.state;
    const { params } = this.props;
    if (file) {
      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
      formData.append('file', file);
      this.submitUpload({ host: 'api/task/sheetUpload', form: formData }).then((res) => {
        if (res.responseCode === '000') {
          this.props.onCallback(res.data.taskId);
          message.success('导入成功');
        } else {
          message.warn(res.responseMsg);
        }
        this.setState({
          confirmLoading: false,
        });
      });
    } else {
      message.warn('请浏览需要导入的文件');
      this.setState({ confirmLoading: false });
    }
  };
  render() {
    const { fileList, confirmLoading, done, uploadError, profit } = this.state;
    const props = {
      // action: PropertyServices.fetchGetTaskSheetUpload,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState({ fileList: [file] });
        return false;
      },
      fileList,
      showUploadList: true,
      accept: EXCEL_ACCEPT,
    };

    const DownloadType = {
      OFFICE: '办公',
      COMMERCIAL: '商业',
      HOTEL: '酒店',
      APARTMENT: '公寓',
      PARK: '园区',
      GARAGE: '车库',
    }[this.props.params.businessType];
    return (
      <Modal
        title="上传文件"
        visible={this.props.visible}
        onOk={this.upload}
        centered={true}
        okText={'导入'}
        confirmLoading={confirmLoading}
        onCancel={this.props.hideModel}
      >
        <div className="upload-model-body">
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 浏览
            </Button>
          </Upload>
          <div className="tip-tit">温馨提示</div>
          <div className="tip">
            请使用模版导入<a
              href={`/templet/月度数据下载模板（全业态）/${DownloadType}.xlsx`}
              download={DownloadType}
              target="_blank"
            >
              下载模版
            </a>
          </div>
          {uploadError && (
            <Alert message={uploadError} type="error" showIcon style={{ marginTop: 15 }} />
          )}
        </div>
      </Modal>
    );
  }
}
