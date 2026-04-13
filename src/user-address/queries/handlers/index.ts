import {
  GetDistrictsHandler,
  GetProvincesHandler,
  GetWardsHandler,
} from './get-location.handler';
import { GetListUserAddressHandler } from './get-list-user-address.handler';

export const QueryHandlers = [
  GetProvincesHandler,
  GetDistrictsHandler,
  GetWardsHandler,
  GetListUserAddressHandler,
];
