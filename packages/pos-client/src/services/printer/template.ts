import { alignCenter, alignLeftRight, RECEIPT_WIDTH } from './printer';
import { StarPRNT } from 'react-native-star-prnt';
import dayjs from 'dayjs';

const date = dayjs().format('DD/MM/YYYY');
const time = dayjs().format('HH:mm:ss');

export const receiptTempate = (commands, org) => {
  return [
    { appendCodePage: StarPRNT.CodePageType.CP858 },
    { appendEncoding: StarPRNT.Encoding.USASCII },
    { appendInternational: StarPRNT.InternationalType.UK },
    { appendFontStyle: 'B' },
    { appendBitmapText: alignCenter(org.name) },
    { appendBitmapText: alignCenter(org.line1) },
    { appendBitmapText: alignCenter(org.line2) },
    { appendBitmapText: alignCenter(org.city) },
    { appendBitmapText: alignCenter(org.county) },
    { appendBitmapText: alignCenter(org.postcode) },
    { appendBitmapText: ' ' },
    { appendBitmapText: alignLeftRight(`Date: ${date}`, `Time: ${time}`, Math.round(RECEIPT_WIDTH / 2)) },
    { appendBitmapText: ' ' },
    ...commands,
  ];
};
