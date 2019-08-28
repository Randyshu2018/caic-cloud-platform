// import OrderServices from 'src/services/order';
import CreateProjectServices from 'src/services/createProject';
import NProgress from 'nprogress';
import { getPageQuery } from 'src/modules/utils';
import { message } from 'antd';
import OrderPay from 'src/modules/orderPay';
import Utils from 'src/containers/CreateProject/utils.js';
import { format } from 'src/modules/date';

export default class Event {
  setFormValues = (data, form) => {
    const o = Object.hasOwnProperty;
    const find = (data = {}, keys = {}) => {
      const setFormValues = {};
      const getFormValue = form.getFieldsValue();

      Object.entries(keys).forEach(([key, formKey]) => {
        const formKeySp = formKey.split('|');
        if (o.call(data, key)) {
          // setFormValues[formKey] = data[key]
          formKeySp.forEach((formKey) => {
            if (o.call(getFormValue, formKey)) {
              const v = data[key];
              setFormValues[formKey] =
                key === 'bizLicenseStartTime'
                  ? v && v.replace(/(年|月)/g, '-').replace(/日/g, '')
                  : v;
            }
          });
        }
      });
      return setFormValues;
    };
    // console.log('data:', data);
    const formType = {
      3: ({ enterprise }) => {
        const formKeys = {
          bizLicenseCompanyName: 'name',
          bizLicenseAddress: 'address',
          bizLicenseCreditCode: 'bizLicenseNum',
          bizLicenseStartTime: 'beginDate',
          // bizLicenseOwnerName: 'legalPersonRealName',
          // idNumber: 'legalPersonIdCardNum'
        };
        return find(enterprise.bizLicense || enterprise.person, formKeys);
      },
      1: ({ personDto }) => {
        const formKeys = {
          name: 'realName|legalPersonRealName',
          idNumber: 'idNum|legalPersonIdCardNum',
        };
        return find(personDto, formKeys);
      },
    };
    if (o.call(formType, data.type)) {
      const formData = formType[data.type](data);
      console.log('data:', formData);
      form.setFieldsValue({ ...formData });
    }
  };
  handleRecognition = async (data, form) => {
    try {
      this.setState({
        loading: true,
        loadingTip: '正在读取图片信息，请等待...',
      });
      NProgress.start();
      const cardID = [
        ['legalPersonIdFrontUrl', 'idCardUpImageUrl'],
        ['legalPersonIdBackUrl', 'idCardDownImageUrl'],
      ];
      const cardLegalPerson = [
        ['idFrontUrl', 'idCardUpImageUrl'],
        ['idBackUrl', 'idCardDownImageUrl'],
      ];
      const card = [...cardID, ...cardLegalPerson];
      const typs = Object.assign(
        {
          bizLicenseUrl: 'bizLicenseImageUrl',
        },
        card.reduce((previousValue, [key, value]) => {
          previousValue[key] = value;
          return previousValue;
        }, {})
      );
      const query = {
        type: this.state.type,
      };
      const getFormValue = (k) => form.getFieldsValue()[k];
      const isFindIndex = (data, key) => data.findIndex(([value]) => value === key) > -1;
      let isServer = true;
      let type = 3;
      if (data.key === 'bizLicenseUrl') {
        query[typs[data.key]] = data.imageUrl;
      } else if (isFindIndex(cardID, data.key)) {
        type = 1;
        cardID.forEach(([formKey, key]) => {
          const value = formKey === data.key ? data.imageUrl : getFormValue(formKey);
          if (!value) {
            isServer = false;
          } else {
            query[key] = value;
          }
        });
      } else if (isFindIndex(cardLegalPerson, data.key)) {
        type = 1;
        cardLegalPerson.forEach(([formKey, key]) => {
          const value = formKey === data.key ? data.imageUrl : getFormValue(formKey);
          if (!value) {
            isServer = false;
          } else {
            query[key] = value;
          }
        });
      }
      // 参数不全
      if (!isServer) throw new Error();
      query.type = type;
      const res = await CreateProjectServices.fetchQueryGetImageInfo(query);
      if (res.responseCode === '000') {
        res.data.type = type;
        this.setFormValues(res.data, form);
      }
      /* else {
        throw new Error('识别失败了，请重试');
      } */
    } catch (error) {
      error && error.message && message.info(error.message);
    } finally {
      this.setState({
        loading: false,
        loadingTip: '',
      });
      NProgress.done();
    }
  };

  onSubmit = async () => {
    try {
      if (this.state.initialValue === '-1') return message.info('请先选择主体');
      this.setState({
        loading: true,
      });
      const { merchantList, initialValue, merchantId } = this.state;
      const values = merchantList[initialValue];
      const { id: projectId = null } = getPageQuery();
      const params = {
        memberId: this.memberId,
        merchantId,
        projectId,
        type: values.type,
      };
      this.queryParams = { ...params };
      if (this.state.initialValueRadio !== '-1') {
        this.setState({
          visible: true,
        });
      } else {
        // 保存主体
        const res = await CreateProjectServices.fetchMerchantSave({ ...params });
        // res.responseCode === '000' && this.fetchOrderCreate(projectId, params.memberId);
        if (res.responseCode === '000') {
          const query = `3?id=${projectId}`;
          Utils.handleLink.call(this, query);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  fetchOrderCreate = async (projectId, memberId) => {
    try {
      this.setState({
        loading: true,
      });
      const res = await CreateProjectServices.fetchOrderCreate({ projectId, memberId });
      // console.log(res);
      if (res.responseCode === '000') {
        const order = res.data;
        new OrderPay().createForm(order);
      }
    } catch (error) {}
  };

  fetchData = async () => {
    NProgress.start();
    const { memberId } = this;
    const { data } = await CreateProjectServices.fetchQueryListMerchantByMember(memberId);
    const isEjuForm = !(Array.isArray(data) && data.length);
    const merchantParams = {};
    if (Array.isArray(data)) {
      merchantParams.merchantList = data;
    }
    this.setState(
      {
        ...merchantParams,
        isEjuForm,
      },
      () => NProgress.done()
    );
  };

  save = async (_params) => {
    let params = { ..._params };
    delete params.id;
    params.beginDate && (params.beginDate = format(params.beginDate));
    const query = {
      3: {
        enterprise: [
          'contactName',
          'contactPhone',
          'bizLicenseNum',
          'bizLicenseUrl',
          'legalPersonIdCard',
          'legalPersonIdFrontUrl',
          'legalPersonIdBackUrl',
          'legalPersonIdCardNum',
          'legalPersonRealName',
          'beginDate',
          'endDate',
          'address',
          'name',
        ],
      },
      1: {
        personal: ['realName', 'idNum', 'idFrontUrl', 'idBackUrl'],
      },
    };
    Object.entries(query[params.type]).forEach(([keyI, values]) => {
      const item = {};
      values.forEach((keyJ) => {
        if (params.hasOwnProperty(keyJ)) {
          item[keyJ] = params[keyJ];
          delete params[keyJ];
        }
      });
      params[keyI] = item;
    });
    params = {
      ...params,
      source: 'QSL_MERCHANT',
    };
    const res = await CreateProjectServices.fetchMerchantSave(params);
    if (res.responseCode === '000') {
      this.setState({ merchantId: res.data }, this.createSignedOrder);
    }
  };

  handleFormChange = ({ target: { value } }) => {
    this.setState({
      type: value,
    });
  };

  handleSelectChange = (initialValue) => {
    this.setState({
      initialValue,
      merchantOrderList:
        initialValue !== '-1' ? this.state.merchantList[initialValue].orderList : [],
      initialValueRadio: '-1',
    });
  };

  handleMerchantClick = () => {
    // if (this.state.initialValue === '-1') return message.info('请先选择主体');
    // const { merchantList, initialValue } = this.state;
    // const values = merchantList[initialValue];
    // this.query.merchantId = values.id;
    this.setState({ isEjuForm: true });
  };
}
