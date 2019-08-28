import React from 'react';
import { Icon } from 'antd';
import { isEmpty } from '../../modules/utils';

export function DiagnoseStatus({ status }) {
  return <Icon type={status ? 'check' : 'minus'} />;
}

export function defaultRender(text) {
  return isEmpty(text) ? <Icon type="minus" /> : text;
}
