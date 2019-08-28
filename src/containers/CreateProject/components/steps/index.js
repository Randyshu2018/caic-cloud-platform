import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { classNameFun, isFunction } from 'src/modules/utils';

class ComponentView extends PureComponent {
  handleClick(steps) {
    isFunction(this.props.clickCallback) && this.props.clickCallback(steps);
  }

  render() {
    const {
      match: { params },
    } = this.props;
    const steps = (Math.floor(params.steps) || 1) - 1;

    const stepsList = [
      {
        type: '1',
        text: '选择套餐',
      },
      {
        type: '2',
        text: '验证身份',
      },
      {
        type: '3',
        text: '创建概要项目',
      },
    ];

    return (
      <Layout className="eju-steps eju-flex-row eju-flex-center">
        <div className="eju-steps_container eju-flex-row eju-flex-center">
          {stepsList.map((item, index) => {
            const cla1 = {
              active: steps >= index,
            };
            const cla2 = {
              active: steps > index,
            };
            const _index = index + 1;
            return (
              <div
                key={index}
                className={classNameFun('eju-steps_item eju-flex eju-flex-center', cla1)}
                onClick={(_) => this.handleClick(item.type)}
              >
                <span>
                  {_index}.{item.text}
                </span>
                {stepsList.length !== _index ? (
                  <div className={classNameFun('eju-steps_triangle', cla2)}>
                    <div className="eju-steps_triangle_body" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Layout>
    );
  }
}

export default ComponentView;
