import { message } from 'antd';

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export const msg = (type, info) => {
  message[type](info);
};
