import React, { Component } from 'react';
import { Input } from 'antd';

const reactH1 = (title) => () => (
  <h1
    style={{
      width: '200%',
      height: '50px',
      lineHeight: '50px',
      backgroundColor: 'rgba(250,251,252,1)',
      marginBottom: '0px',
      fontSize: '14px',
      color: '#8FA1B7',
      paddingLeft: '30px',
    }}
  >
    {title}
  </h1>
);

export default (floor, room) => {
  const render = (value = '') => {
    const valueData = `${value}`.split('|');
    return valueData[1] || valueData[0];
  };
  return {
    key: 'rent-form',
    childer: [
      {
        key: 'title',
        title: reactH1('房源信息'),
        type: 'title',
        isItem: true,
      },
      {
        key: 'contractRooms',
        title: '_null',
        isItem: true,
        tableColumns: [
          {
            title: '选择楼宇',
            dataIndex: 'buildingName',
            key: 'buildingName',
            editable: true,
            width: 150,
            align: 'left',
            editData: [],
            render,
          },
          {
            title: '选择楼层',
            dataIndex: 'floorName',
            key: 'floorName',
            editable: true,
            width: 150,
            align: 'left',
            editData: [],
            render,
          },
          {
            title: '选择房源',
            dataIndex: 'roomName',
            key: 'roomName',
            editable: true,
            width: 150,
            align: 'left',
            editData: [],
            render,
          },
          {
            title: '面积/m²',
            dataIndex: 'area',
            key: 'area',
            editable: true,
            width: 150,
            align: 'left',
          },
        ],
        dataSource: [
          // {
          //   floorName: '0',
          //   roomName: '0',
          //   area: '0',
          // },
        ],
        type: 'editableTable2',
      },
      {
        key: 'title',
        title: reactH1('租客信息'),
        type: 'title',
        isItem: true,
      },
      {
        key: 'lessee',
        title: '承租方',
        placeholder: '输入承租方名称',
        span: 12,
      },
      {
        key: 'industry',
        title: '行业',
        placeholder: '输入行业名称',
        span: 12,
      },
      {
        key: 'legalPerson',
        title: '法人',
        placeholder: '输入法人名称',
        span: 12,
      },
      {
        key: 'signer',
        title: '签订人',
        placeholder: '输入签订人名称',
        span: 12,
      },
      {
        key: 'contactName',
        title: '承租方联系人',
        placeholder: '输入承租方联系人名称',
        span: 12,
      },
      {
        key: 'contactPhone',
        title: '联系电话',
        span: 12,
        render: ({ props }, data) => {
          const { form } = props;
          const comparePhoneNum = (rule, value, callback) => {
            if (
              /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value) ||
              /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
            ) {
              callback();
            } else {
              callback('请输入正确的联系号码');
            }
          };
          return form.getFieldDecorator(data.key, {
            rules: [
              {
                validator: comparePhoneNum,
              },
            ],
          })(<Input placeholder="输入联系电话" />);
        },
      },
      {
        key: 'titlecon',
        title: reactH1('合同信息'),
        type: 'title',
        isItem: true,
      },
      {
        key: 'contractNO',
        title: '合同编号',
        placeholder: '请输入合同编号...',
        spanCol: 24,
      },
      // {
      //   key: 'payNumberTitle',
      //   title: '支付方式',
      //   span: 12,
      //   width: '41%',
      //   initialValue: [
      //     {
      //       id: 1,
      //     },
      //     {
      //       id: 3,
      //     },
      //   ],
      //   editData: {
      //     depositNumber: [
      //       { id: 1, value: '押一' },
      //       { id: 2, value: '押二' },
      //       { id: 3, value: '押三' },
      //       { id: 4, value: '押四' },
      //       { id: 5, value: '押五' },
      //       { id: 6, value: '押六' },
      //       { id: 7, value: '押七' },
      //       { id: 8, value: '押八' },
      //       { id: 9, value: '押九' },
      //       { id: 10, value: '押十' },
      //       { id: 11, value: '押十一' },
      //       { id: 12, value: '押十二' },
      //     ],
      //     payNumber: [
      //       { id: 1, value: '付一' },
      //       { id: 2, value: '付二' },
      //       { id: 3, value: '付三' },
      //       { id: 4, value: '付四' },
      //       { id: 5, value: '付五' },
      //       { id: 6, value: '付六' },
      //       { id: 7, value: '付七' },
      //       { id: 8, value: '付八' },
      //       { id: 9, value: '付九' },
      //       { id: 10, value: '付十' },
      //       { id: 11, value: '付十一' },
      //       { id: 12, value: '付十二' },
      //     ],
      //   },
      //   render(formThis, data) {
      //     const creatSelect = (data, index) => (
      //       <React.Fragment key={index}>
      //         {index === 1 ? <span style={{ margin: '0 10px' }}>-</span> : ''}
      //         {formThis.renderSelect(data)}
      //       </React.Fragment>
      //     );
      //     return (
      //       <div className="eju-flex">
      //         {Object.entries(data.editData).map(([key, editData], index) =>
      //           creatSelect(
      //             { key, editData, width: data.width, initialValue: data.initialValue[index].id },
      //             index
      //           )
      //         )}
      //       </div>
      //     );
      //   },
      // },
      // {
      //   key: 'depositAmt',
      //   title: '保证金/元',
      //   span: 12,
      //   render: ({ props }, data) => {
      //     const { form } = props;
      //     const comparePrice = (rule, value, callback) => {
      //       if (/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
      //         callback();
      //       } else {
      //         callback('保证金最多输入小数点后两位');
      //       }
      //     };
      //     return form.getFieldDecorator(data.key, {
      //       rules: [
      //         {
      //           validator: comparePrice,
      //         },
      //       ],
      //     })(<Input placeholder="请输入保证金" />);
      //   },
      // },
      {
        key: 'signingDate',
        title: '合同签订时间',
        type: 'datePicker',
        span: 12,
      },
      // {
      //   key: 'singlePrice',
      //   title: '合同单价(元/㎡.天）',
      //   span: 12,
      //   render: ({ props }, data) => {
      //     const { form } = props;
      //     const comparePrice = (rule, value, callback) => {
      //       if (/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
      //         callback();
      //       } else {
      //         callback('合同单价最多输入小数点后两位');
      //       }
      //     };
      //     return form.getFieldDecorator(data.key, {
      //       rules: [
      //         {
      //           validator: comparePrice,
      //         },
      //       ],
      //     })(<Input placeholder="输入合同单价" />);
      //   },
      // },
      {
        key: 'beginSignDate',
        title: '合同记租时间',
        type: 'datePicker',
        span: 12,
      },
      {
        key: 'endSignDate',
        title: '合同结束时间',
        type: 'datePicker',
        span: 12,
      },
      {
        title: '_null',
        key: 'attachFilesUrl',
        spanCol: 24,
        type: 'upload',
        uploadConfig: {
          title: () => (
            <h1 style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '20px' }}>合同附件</h1>
          ),
          label: '上传合同附件',
          // 最大长度 default 1
          uploadMax: 5,
          // 限制文件类型 default image/*
          fileAccept: 'image/*,.pdf,.doc,.docx',
          // 对应类型的多种属性
          fileType: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
        },
      },
    ],
  };
};
