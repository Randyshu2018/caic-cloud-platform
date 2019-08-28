import React from 'react';
import { Form, Select, Button, Radio } from 'antd';
import FormLayout from 'src/components/Form/sapleForm';
import * as Context from 'src/containers/Rent/context';

const { ContextComponent } = Context;

/**
   * @param [Object] data
   * @param [String] data.key
   * @param [Array] data.childer
   * @param [String] data.childer[n].key  若是表单值则必须唯一，否则获取表单值会有问题，若当前项类型为title，则key也为title
   * @param [String] data.childer[n].type  表单项类型 
   textArea|datePicker|cityInput|map|select|input|inputHidden|radio|_radio|uploadImg|selectCity|radioInput|checkbox
   * @param [String] data.childer[n].title  标题名称
   * @param [String] data.childer[n].placeholder placeholder 
   * @param [Array] data.childer[n].editData 在设置 如select|radio|checkbox等类型，需要一个列表组
   * @param [String] data.childer[n].span  [栅格布局](https://ant.design/components/grid-cn/)
   * @param [Boolean] data.childer[n].isInput  在类型为select|radio|checkbox时，若需要和input组合使用，则需设置为true
   * @param [String] data.childer[n].after  类型为input，且需要添加后缀如单位等
   * @param [String] data.childer[n].initialValue  初始默认值
   * @param [Boolean] data.childer[n].isItem  设为true时，则该项节点不受表单默认布局影响
   * @param [Function] data.childer[n].render  若表单内置组件不满足于需求开发，或者需要扩展组件，则使用该方法。对外开发内部方法，自定义渲染组件，
   *
   * 值得注意的是，参数中，data.childer[n].render 优先级最高，若定义了 此项， data.childer[n].type 会失效
   */
// const data = {
//   key: 'form1',
//   childer: [
//     {
//       key,
//       title,
//       type,
//       placeholder,
//       editData,
//       span,
//       disabled,
//       isInput，
//       after,
//       initialValue，
//       isItem,
//       render
//       /**
//       render(formThis, data) {
//         // formThis 可以获取组件内所以公开方法
//         // data 当前项值
//         // 某有些业务场景下，无法使用form.getFieldDecorator
//         return [
//           component,
//           // 创建一个隐藏输入框
//           // 在你等组件值有改变时，通过formThis.setFieldsValue({ [data.key]: value });设置到当前表单
//           formThis.renderInputHidden(data)
//         ]
//       }
//       */
//     }
//   ]
// }
// 使用 react Context方法调用
// import * as Context from 'src/containers/Property/context';
// const { ContextComponent } = Context;
const buildNews = [
  {
    id: 29,
    name: '5',
    mgtArea: '200.00',
    executeDelete: false,
    roomsMgtArea: '10.00',
    rooms: [
      {
        id: 90,
        name: '501',
        mgtArea: '10.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
    ],
  },
  {
    id: 26,
    name: '4',
    mgtArea: '200.00',
    executeDelete: false,
    roomsMgtArea: '153.00',
    rooms: [
      {
        id: 89,
        name: '103',
        mgtArea: '103.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
      {
        id: 87,
        name: '102',
        mgtArea: '30.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
      {
        id: 86,
        name: '101',
        mgtArea: '20.00',
        roomStatus: 'UN_SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
    ],
  },
  {
    id: 19,
    name: '3',
    mgtArea: '100.00',
    executeDelete: false,
    roomsMgtArea: '70.00',
    rooms: [
      {
        id: 92,
        name: '302',
        mgtArea: '20.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
      {
        id: 78,
        name: '102',
        mgtArea: '20.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
      {
        id: 77,
        name: '101',
        mgtArea: '30.00',
        roomStatus: 'UN_SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
    ],
  },
  {
    id: 23,
    name: '2',
    mgtArea: '111.00',
    executeDelete: false,
    roomsMgtArea: '80.00',
    rooms: [
      {
        id: 91,
        name: '203',
        mgtArea: '10.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
    ],
  },
  {
    id: 17,
    name: '1',
    mgtArea: '200.00',
    executeDelete: false,
    roomsMgtArea: '193.00',
    rooms: [
      {
        id: 82,
        name: '104',
        mgtArea: '33.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
      {
        id: 88,
        name: '101',
        mgtArea: '100.00',
        roomStatus: 'SIGNED',
        contractId: null,
        contractBeginDate: null,
        contractEndDate: null,
        contractStatus: false,
      },
    ],
  },
];

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        key: 'sample-form',
        childer: [
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>房源信息2</h1>,
            type: 'title',
          },
          {
            key: 'formItem8-32',
            title: '_null',
            tableColumns: [
              {
                title: '选择楼层',
                dataIndex: 'key1',
                key: 'key1',
                editable: true,
                width: 100,
                align: 'left',
                inputType: 'select',
                editData: [
                  {
                    id: '1',
                    value: '1层',
                  },
                ],
              },
              {
                title: '选择房源',
                dataIndex: 'key2',
                key: 'key2',
                editable: true,
                width: 100,
                align: 'left',
                inputType: 'select',
                editData: [
                  {
                    id: '2',
                    value: '知乎',
                  },
                ],
              },
              {
                title: '面积',
                dataIndex: 'key3',
                key: 'key3',
                editable: false,
                width: 200,
                align: 'left',
              },
            ],
            dataSource: [
              // {
              //   key1: '1',
              //   key2: '2',
              //   key3: '3',
              // },
            ],
            type: 'editableTable2',
          },
          {
            title: '法人身份证',
            key: 'card',
            type: 'uploadImg',
            isItem: true,
            formKey: {
              legalPersonIdFrontUrl: '上传身份证正面',
              legalPersonIdBackUrl: '上传身份证反面',
            },
          },
          {
            title: '_null',
            key: 'BASIC_OFFICE_PIC_WLM2',
            span: 12,
            type: 'upload',
            uploadConfig: {
              title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>合同上传</h1>,
              label: '上传文件',
              // 最大长度 default 1
              uploadMax: 3,
              listType: 'picture',
            },
          },
          {
            title: '_null',
            key: 'BASIC_OFFICE_PIC_WLM',
            span: 12,
            type: 'upload',
            uploadConfig: {
              title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>合同上传2</h1>,
              label: '上传文件',
              // 最大长度 default 1
              uploadMax: 3,
              // 限制文件类型 default image/*
              fileAccept: 'image/*,.pdf',
              // 对应类型的多种属性
              fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'application/pdf'],
              listItemStyle: {
                width: '192px',
                height: '128px',
                padding: '0',
                margin: '10px 15px 15px 0',
              },
            },
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '24px', margin: '10px 0' }}>基本用法</h1>,
            type: 'title',
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>标题</h1>,
            type: 'title',
          },
          {
            key: 'title',
            title: '1. 默认title',
            type: 'title',
          },
          {
            key: 'title',
            title: () => <div style={{ color: 'red', padding: '0 20px' }}>2. 自定义title</div>,
            type: 'title',
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>输入框</h1>,
            type: 'title',
          },
          {
            key: 'formItem1',
            title: '输入框',
            placeholder: '请输入...',
            after: '单位',
          },
          {
            key: 'formItem1-3',
            title: '输入框-非必填',
            placeholder: '请输入...',
            // 非必填
            rules: [{ required: false }],
          },
          {
            key: 'formItem1-2',
            title: '输入框-值',
            placeholder: '请输入...',
            initialValue: '默认值001',
          },
          {
            key: 'formItem1-1',
            title: '输入框-禁用',
            placeholder: '请输入...',
            // 是否禁用
            disabled: true,
          },
          {
            key: 'formItem3',
            title: '数字输入框',
            InputType: 'InputNumber',
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>radio</h1>,
            type: 'title',
          },
          {
            key: 'formItem2',
            title: '使用默认radio',
            type: 'radio',
            initialValue: '1',
            editData: [{ id: '1', value: '1' }, { id: '2', value: '2' }],
          },
          {
            key: 'formItem2-1',
            title: 'radio+input',
            initialValue: '40年',
            editData: ['40年', '50年', '70年', 'inputOther'].map((value) => ({ id: value, value })),
            type: 'radio',
            isInput: true,
          },
          {
            key: 'formItem2-2',
            title: '自定义radio',
            type: 'radio',
            initialValue: '2',
            editData: [{ id: '1', value: '1' }, { id: '2', value: '2' }],
            render: ({ props }, data) => {
              const { form } = props;
              const { editData } = data;
              return form.getFieldDecorator(data.key, {
                initialValue: data.initialValue,
                rules: [{ required: true }],
              })(
                <Radio.Group key={data.key}>
                  {editData.map((item, index) => (
                    <Radio key={index} value={item.id}>
                      {item.value}
                    </Radio>
                  ))}
                </Radio.Group>
              );
            },
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>select</h1>,
            type: 'title',
          },
          {
            title: 'select',
            key: 'formItem3-1',
            type: 'select',
            initialValue: 'COMMERCIAL',
            editData: 'COMMERCIAL|商业,HOTEL|酒店,OFFICE|办公,GARAGE|车库,APARTMENT|公寓,PARK|园区'
              .split(',')
              .map((v) => {
                const sv = v.split('|');
                return { id: sv[0], value: sv[1] };
              }),
          },
          {
            title: 'select+input',
            key: 'formItem3-3',
            type: 'select',
            initialValue: '12',
            inputWidth: '50px',
            editData: [
              {
                id: '12',
                value: '12',
              },
              {
                id: '121',
                value: '121',
              },
              {
                id: 'inputOther',
                value: 'inputOther',
              },
            ],
            isInput: true,
          },
          {
            title: 'selectCity',
            key: 'formItem3-2',
            type: 'selectCity',
            initialValue: 'COMMERCIAL',
            editData: [],
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>checkbox</h1>,
            type: 'title',
          },
          {
            key: 'formItem4-1',
            title: 'checkbox',
            editData: [
              {
                id: '住宅',
                value: '住宅',
              },
              {
                id: '商业',
                value: '商业',
              },
              {
                id: '办公',
                value: '办公',
              },
              {
                id: '工业',
                value: '工业',
              },
            ],
            type: 'checkbox',
            initialValue: ['办公'],
          },
          {
            key: 'formItem4-2',
            title: 'checkbox+input',
            initialValue: ['住宅', '工业', '其他330'],
            editData: [
              {
                id: '住宅',
                value: '住宅',
              },
              {
                id: '商业',
                value: '商业',
              },
              {
                id: '办公',
                value: '办公',
              },
              {
                id: '工业',
                value: '工业',
              },
            ],
            type: 'checkbox',
            isInput: true,
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>布局</h1>,
            type: 'title',
          },
          {
            key: 'formItem6-1',
            title: 'input1',
            span: 12,
          },
          {
            key: 'formItem6-2',
            title: 'input2',
            span: 12,
          },
          {
            key: 'formItem6-3',
            title: 'input3',
            span: 8,
          },
          {
            key: 'formItem6-5',
            title: 'input4',
            span: 8,
          },
          {
            key: 'formItem6-41',
            title: 'input5',
            span: 8,
          },
          {
            key: 'formItem6-52',
            title: 'input6',
            span: 14,
          },
          {
            key: 'formItem6-63',
            title: 'input7',
            span: 10,
          },
          {
            key: 'formItem6-7',
            title: 'input8',
            span: 10,
          },
          {
            key: 'formItem6-8',
            title: 'input9',
            span: 14,
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>时间选择</h1>,
            type: 'title',
          },
          {
            key: 'formItem7-31',
            title: '合同签订时间',
            type: 'datePicker',
            span: 12,
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>上传</h1>,
            type: 'title',
          },
          {
            key: 'title',
            title: () => <h1 style={{ fontSize: '18px', margin: '10px 0' }}>房源信息</h1>,
            type: 'title',
          },
          {
            key: 'formItem8-31',
            title: '_null',
            tableColumns: [
              {
                title: '选择楼层',
                dataIndex: 'TENANT_NAME',
                key: 'TENANT_NAME',
                editable: true,
                width: 190,
                align: 'center',
              },
              {
                title: '选择房源',
                dataIndex: 'TENANT_INDUSTRY',
                key: 'TENANT_INDUSTRY',
                editable: true,
                width: 115,
                align: 'center',
              },
              {
                title: '面积',
                dataIndex: 'TENANT_FLOOR',
                key: 'TENANT_FLOOR',
                editable: true,
                width: 100,
                align: 'center',
              },
              {
                title: '面积2',
                dataIndex: 'TENANT_FLOOR',
                key: 'TENANT_FLOOR',
                editable: true,
                width: 100,
                align: 'center',
                inputType: 'dataPicker',
              },
            ],
            dataSource: [],
            type: 'editableTable',
          },
        ],
      },
    };
  }
  componentDidMount() {
    this.setState({
      buildNewsList: buildNews,
    });
  }
  get requset() {
    return {
      get: async (params = {}) => {
        // fetch
        // 设置参数
        // const query = {
        //   ...params,
        //   // add query...
        // }
        // const res = await PropertyServices.fetchGetTask(query);
        const res = {
          'formItem8-32': [
            {
              floorName: 29,
              roomName: 90,
              area: '30.22',
            },
            {
              floorName: 26,
              roomName: 89,
              area: '82.22',
            },
          ],
          'formItem7-31': '2017-03-29',
          BASIC_OFFICE_PIC_WLM: [
            'http://qiushilian.ess.ejucloud.cn/1562298156785/WechatIMG27.jpeg',
            'http://qiushilian.ess.ejucloud.cn/1562299629088/分会场1_1_胡成全_mpvue_小程序开发框架和最佳实践.pdf',
            'http://qiushilian.ess.ejucloud.cn/1562558166778/员工内部推荐奖励办法.pdf',
          ],
        };
        console.log('requset get: 获取数据');
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ ...res });
            console.log('async 1s?');
          }, 1000);
        });
      },
      set: async (formValue = {}) => {
        // fetch
        // const res = await PropertyServices.fetchGetTask(formValue);
        console.log('requset get: 保存数据');
        console.log('formValue:', formValue);
        const res = {};
        return { ...res };
      },
    };
  }

  render() {
    const {
      state: { params, data },
      requset,
    } = this;
    const propsValue = {
      data,
      params,
      requset,
      // 布局
      labelCol: {},
      wrapperCol: {},
    };
    return (
      <div style={{ width: 1400, margin: '0 auto', padding: '50px' }}>
        {/* <ContextComponent.Provider
          value={propsValue}
      >
        <FormLayout
          renderBtn={() => (
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          )}
        >
          <Button type="upload" icon="upload" onClick={this.handleUpload}>
          导入
          </Button>
        </FormLayout>
      </ContextComponent.Provider> */}
        <ContextComponent.Provider value={{ buildNewsList: this.state.buildNewsList || [] }}>
          {<FormLayout {...propsValue} />}
        </ContextComponent.Provider>
      </div>
    );
  }
}

export default View;
