import { spacing } from '../theme';
import { moderateScale } from './scaling';

export const MAX_GRID_SIZE = 8;
export const GRID_SPACING = moderateScale(5);
export const RECEIPT_PANEL_WIDTH = moderateScale(550);
export const RECEIPT_PANEL_BUTTONS_WIDTH = moderateScale(120);
export const ITEM_SPACING = spacing[4];

export enum paymentTypeNames {
  CASH = 'cash',
  CARD = 'card',
  VOUCHER = 'voucher',
}
