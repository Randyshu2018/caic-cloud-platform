import React from 'react';
import '../style/index.scss';
import { Tooltip } from 'antd';
import Contract from '../tmpl/contract';
import { events } from 'func';
const rate = (num1, num2) => (+num1 / +num2) * 100;
const contractStatus = (val) => {
  const { roomStatus, contractStatus } = val;
  switch (roomStatus) {
    case 'UN_SIGNED':
      return 'grey';
    case 'SIGNED':
      return contractStatus ? 'blue' : 'yellow';
    case 'EXPIRED':
      return 'grey';
    default:
  }
};
export class App extends React.Component {
  state = {
    visible: false,
    isBlank: true,
    floor: {},
    room: {},
  };
  componentDidMount() {
    events.on('saveContractNext', this.reload);
  }
  reload = () => {
    this.closeModal();
    window.getBuildManageBuilding && window.getBuildManageBuilding();
  };
  openModal = (floor, room) => {
    this.setState({
      visible: true,
      floor,
      room,
      isBlank: room.roomStatus === 'UN_SIGNED',
    });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  componentWillUnmount() {
    events.removeListener('saveContractNext', this.reload);
  }
  render() {
    const { floorList, building } = this.props;
    const { visible, floor, room, isBlank } = this.state;
    return (
      <React.Fragment>
        {floorList.length ? (
          <ul className="hasbuild-news-list">
            <li>
              <h3>楼层</h3>
              <i>面积(㎡)</i>
            </li>
            {floorList.map((v, i) => {
              return (
                <li key={i}>
                  <h4>{v.name}</h4>
                  <span>{v.mgtArea}</span>
                  <div>
                    {v.rooms.length ? (
                      v.rooms.map((val, index) => {
                        const str =
                          val.roomStatus === 'UN_SIGNED'
                            ? '空置'
                            : `${val.contractEndDate || ''}到期`;
                        return (
                          <Tooltip key={index} title={`${val.name}:${val.mgtArea}㎡ ; ${str}`}>
                            <section
                              className={contractStatus(val)}
                              style={{ width: `${rate(val.mgtArea, v.roomsMgtArea)}%` }}
                              onClick={() => this.openModal(v, val)}
                            >
                              <span>
                                {val.name}:{val.mgtArea}㎡
                              </span>
                              {rate(val.mgtArea, v.roomsMgtArea) > 20 && <span>{str}</span>}
                            </section>
                          </Tooltip>
                        );
                      })
                    ) : (
                      <div className="build-manage-no-rooms">暂无房源</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>暂时没有楼层信息</div>
        )}
        {visible && (
          <Contract
            close={this.closeModal}
            floor={floor}
            room={room}
            isBlank={isBlank}
            building={building}
          />
        )}
      </React.Fragment>
    );
  }
}
export default App;
