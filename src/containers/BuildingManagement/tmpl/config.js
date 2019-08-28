import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Drawer, Row, Col, Form, Button } from 'antd';
// import FormLayout from 'src/components/Form/rentForm';
// import contractConfig from './config';
import '../style/index.scss';
import { rowList } from './tmpl';
const ContractTitle = ({ title, margin }) => (
  <div className="build-contract-title" style={{ marginTop: margin ? 20 : 0 }}>
    {title}
  </div>
);
export default (floor, room, gfd, contractData, building) => (
  <React.Fragment>
    <ContractTitle title="房源信息" />
    {rowList(
      [
        {
          type: 'input',
          col: 5,
          label: '选择楼宇',
          disabled: true,
          title: 'buildingId',
          initialValue: building.name,
          // data: contractData
        },
        {
          type: 'input',
          col: 5,
          label: '选择楼层',
          disabled: true,
          title: 'floorId',
          initialValue: floor.name,
          // data: contractData
        },
        {
          type: 'input',
          col: 5,
          label: '选择房源',
          disabled: true,
          title: 'roomId',
          initialValue: room.name,
          // data: contractData
        },
        {
          type: 'input',
          col: 5,
          label: '面积/㎡',
          disabled: true,
          title: 'area',
          initialValue: room.mgtArea,
          // data: contractData
        },
      ],
      gfd
    )}
    <ContractTitle title="租客信息" margin />
    {rowList(
      [
        {
          type: 'input',
          col: 11,
          label: '承租方',
          title: 'lessee',
          data: contractData,
        },
        {
          type: 'input',
          col: 11,
          label: '行业',
          title: 'industry',
          data: contractData,
        },
      ],
      gfd
    )}
    {rowList(
      [
        {
          type: 'input',
          col: 11,
          label: '法人',
          title: 'legalPerson',
          data: contractData,
        },
        {
          type: 'input',
          col: 11,
          label: '签订人',
          title: 'signer',
          data: contractData,
        },
      ],
      gfd
    )}
    {rowList(
      [
        {
          type: 'input',
          col: 11,
          label: '承租方联系人',
          title: 'contactName',
          data: contractData,
        },
        {
          type: 'input',
          col: 11,
          label: '联系电话',
          title: 'contactPhone',
          data: contractData,
        },
      ],
      gfd
    )}
    <ContractTitle title="合同信息" margin />
    {rowList(
      [
        {
          type: 'input',
          col: 22,
          label: '合同编号',
          title: 'contractNO',
          data: contractData,
        },
      ],
      gfd
    )}
    {/* {rowList(
      [
        {
          type: 'pay',
          col: 11,
          label: '支付方式',
          data: contractData,
        },
        {
          type: 'input',
          col: 11,
          label: '保证金/元',
          title: 'depositAmt',
          data: contractData,
        },
      ],
      gfd
    )} */}
    {rowList(
      [
        {
          type: 'date',
          col: 11,
          label: '合同签订时间',
          title: 'signingDate',
          data: contractData,
        },
        // {
        //   type: 'input',
        //   col: 11,
        //   label: '合同单价(元/㎡.天)',
        //   title: 'singlePrice',
        //   data: contractData,
        // },
        {
          type: 'date',
          col: 11,
          label: '合同记租时间',
          title: 'beginSignDate',
          data: contractData,
        },
      ],
      gfd
    )}
    {rowList(
      [
        // {
        //   type: 'date',
        //   col: 11,
        //   label: '合同记租时间',
        //   title: 'beginSignDate',
        //   data: contractData,
        // },
        {
          type: 'date',
          col: 11,
          label: '合同结束时间',
          title: 'endSignDate',
          data: contractData,
        },
      ],
      gfd
    )}
  </React.Fragment>
);
