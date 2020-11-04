import { alignCenter, alignLeftRight } from './helpers';
import { StarPRNT } from 'react-native-star-prnt';
import dayjs from 'dayjs';
import { Organization } from '../../models';

const date = dayjs().format('DD/MM/YYYY');
const time = dayjs().format('HH:mm');

export const receiptTempate = (commands: any[], organization: Organization, printWidth: number) => {
  const { name, addressLine1, addressLine2, addressCity, addressCounty, addressPostcode } = organization;
  return [
    { appendCodePage: StarPRNT.CodePageType.CP858 },
    { appendEncoding: StarPRNT.Encoding.USASCII },
    { appendInternational: StarPRNT.InternationalType.UK },
    { appendFontStyle: 'B' },
    { appendBitmapText: alignCenter(name, printWidth) },
    { appendBitmapText: alignCenter(addressLine1, printWidth) },
    { appendBitmapText: alignCenter(addressLine2, printWidth) },
    { appendBitmapText: alignCenter(addressCity, printWidth) },
    { appendBitmapText: alignCenter(addressCounty, printWidth) },
    { appendBitmapText: alignCenter(addressPostcode, printWidth) },
    { appendBitmapText: ' ' },
    {
      appendBitmapText: alignLeftRight(`Date: ${date}`, `Time: ${time}`, printWidth, Math.round(printWidth / 2)),
    },
    { appendBitmapText: ' ' },
    ...commands,
  ];
};
