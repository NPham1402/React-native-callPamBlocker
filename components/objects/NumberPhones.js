import Realm from 'realm';

class NumberPhones extends Realm.Object {}
NumberPhones.schema = {
  name: 'Contact',
  properties: {
    recordID: 'string',
    displayName: 'String',
    phoneNumber: 'string',
    isBlock: 'bool',
  },
  primaryKey: 'recordID',
};

export default new Realm({schema: [NumberPhones]});
