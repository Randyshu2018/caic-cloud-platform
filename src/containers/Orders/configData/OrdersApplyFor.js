import React from 'react'
// 选择开具类型
// 1. 企业 
// 2. 个人
export const applyTypes = [{ id: 3, value: '企业' }, { id: 1, value: '个人' }];
const issue = (initialValue) => {
  return {
    key: 'GARAGE_JYSR_DSYZSR2',
    title: '开具类型',
    type: 'radio',
    initialValue,
    issueRoot: true,
    editData: [...applyTypes]
  }
}
const enterpriseData = {
  开具类型: [
    issue(3)
  ],
  发票详情: [
    {
      key: 'GARAGE_JYSR_DSYZSR',
      title: '发票抬头',
      placeholder: '请填写您营业执照上的全称'
    },
    {
      key: 'GARAGE_JYSR_DXYZSR',
      title: '发票类型',
      initialValue: 3,
      editData: [{ id: 3, value: '企业增值税普通发票' }, { id: 1, value: '增值税专用发票' }],
      type: 'radio',
      applyRoot: 1
    },
    {
      key: 'GARAGE_JYSR_DSSZSR',
      title: '税务登记证号',
      placeholder: '请填写15到20位有效纳税人识别号',
      tip: '请仔细填写准确的三证合一后的社会统一信用代码或税务登记证号',
      render: (props, data) => {
        return (
          <div key={data.key}>
            {
              props.renderInput(data)
            }
            <span style={{ color: '#F58D42' }}>
            {
              data.tip
            }
            </span>
          </div>
        )
      }
    },
    {
      key: 'GARAGE_JYSR_DXSZSR',
      title: '基本开户银行名称',
      placeholder: '请填写您开户许可证上的开户银行',
      rules: [{ required: false }],
    },
    {
      key: 'GARAGE_JYSR_QTSR1',
      title: '基本开户账号',
      placeholder: '请填写您开户许可证上的银行账号',
      rules: [{ required: false }],
    },
    {
      key: 'GARAGE_JYSR_QTSR2',
      title: '注册场所地址',
      placeholder: '请填写您营业执照上的注册地址',
      rules: [{ required: false }],
    },
    {
      key: 'GARAGE_JYSR_QTSR3',
      title: '注册固定电话',
      placeholder: '请填写15到20位有效纳税人识别号',
      rules: [{ required: false }],
    },
  ],
  注册固定电话: [
    {
      key: 'GARAGE_ZJQK_SZCWSFJG1',
      title: '邮寄联系人姓名',
      placeholder: '请填写邮寄联系人姓名',
    },
    {
      key: 'GARAGE_ZJQK_SZCWSFJG2',
      title: '邮寄联系人号码',
      placeholder: '请填写邮寄联系人手机号码',
    },
    {
      key: 'GARAGE_ZJQK_SZCWSFJG3',
      title: '邮寄地址',
      placeholder: '请填写邮寄地址',
    },
  ],
}
const personageData = {
  开具类型: [
    issue(1)
  ],
  发票详情: [
    {
      key: 'GARAGE_JYSR_DSYZSR12',
      title: '姓名',
      placeholder: '请输入您的姓名'
    },
    {
      key: 'GARAGE_JYSR_DXYZSR23',
      title: '发票类型',
      initialValue: '增值税普通发票',
      render: (_, data) => {
        return (
          <div key={data.key}>{data.initialValue}</div>
        )
      }
    }
  ],
  接收方式: [
    {
      key: 'GARAGE_ZJQK_SZCWSFJG1',
      title: '邮寄联系人姓名',
      placeholder: '请填写邮寄联系人姓名',
    },
    {
      key: 'GARAGE_ZJQK_SZCWSFJG2',
      title: '邮寄联系人号码',
      placeholder: '请填写邮寄联系人手机号码',
    },
    {
      key: 'GARAGE_ZJQK_SZCWSFJG3',
      title: '邮寄地址',
      placeholder: '请填写邮寄地址',
    },
  ],
}
const childers = {}
function assemble(data, key) {
  const childer = [];
  Object.entries(data).forEach(([title, values], index) => {
    const arr = [...values];
    arr.unshift({ key: `title-${index}`, type: 'title', title });
    childer.push(...arr);
  });
  childers[key] = childer;
}
assemble(enterpriseData, 0)
assemble(personageData, 1)

export default function (type = 3) {
  const keys = {
    3: {
      key: 0,
      title: '发票申请-企业'
    },
    1: {
      key: 1,
      title: '发票申请-个人'
    }
  }
  const { key, title} = keys[type]
  const DataSources = {
    title,
    childer: [...childers[key]]
  }
  return DataSources;
};