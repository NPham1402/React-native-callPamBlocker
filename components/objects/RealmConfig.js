import Profile from './Models/Profile';
import {createRealmContext} from '@realm/react';
import NumberPhones from './NumberPhones';
export const SyncedRealmContext = createRealmContext({
  schema: [NumberPhones],
});
