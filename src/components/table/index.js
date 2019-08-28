import React from 'react'
import { Table, Icon } from 'antd'
import './style.scss';
class EJUTable extends React.Component {
  onChange = () => {}
  render() {
    // 列表的数据结构
    // data: <title> <key> <width> <align>
    const columns = this.props.columns
    const cols = []
    if (columns && columns.length) {
      for (let i = 0; i < columns.length; i++) {
        const it = columns[i]
        const data = (it.data || '').split(',').map(res => res.trim())

        const item = {
          title: data[0],
          key: `${data[1]}`,
          className: it.className || `EJU-table-item__${data[1]}`,
          dataIndex: `${data[1]}`,
        }

        // 这项是数字
        data[2] = data[2] - 0
        if (data[2] === ~~data[2]) {
          item.width = data[2]
        }
        else if (['left', 'center', 'right'].indexOf(data[2]) !== -1) {
          item.align = data[2]
        }
        if (['left', 'center', 'right'].indexOf(data[3]) !== -1) {
          item.align = data[3]
        }

        if (it.render) {
          item.render = it.render
        }
        else {
          item.render = e => {
            return (typeof e !== 'undefined' && e !== null) ? e : '-'
          }
        }

        if (it.renderConsole) {
          item.render = (e, d) => {
            const list = it.renderConsole(d) || null
            return (
              <div key={d.key} className="EJU-table__console">
                {list}
              </div>
            )
          }
        }

        if (it.fixed) {
          item.fixed = it.fixed
        }

        cols.push(item)
      }
    }
    
    return (
      <Table
        rowKey={record => record.uid}
        className="EJU-table"
        dataSource={this.props.dataSource}
        columns={cols}
        onChange={this.onChange}
        loading={this.props.loading}
        pagination={this.props.pagination}
        locale={{
          emptyText: <p className={'empty-text'} key="locale"><Icon type="frown-o" />暂无数据</p>
        }}
      />
    )
  }
}

export default EJUTable