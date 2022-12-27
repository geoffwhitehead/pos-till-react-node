import dayjs from 'dayjs';
import { StarPRNT } from 'react-native-star-prnt';
import { Organization } from '../../models';
import { alignCenter, alignLeftRight } from './helpers';

export const receiptTempate = (commands: any[], organization: Organization, printWidth: number) => {
  const { name, addressLine1, addressLine2, addressCity, addressCounty, addressPostcode } = organization;
  return [
    { appendCodePage: StarPRNT.CodePageType.CP858 },
    { appendEncoding: StarPRNT.Encoding.USASCII },
    { appendInternational: StarPRNT.InternationalType.UK },
    { appendBitmapText: alignCenter(name, printWidth) },
    { appendBitmapText: alignCenter(addressLine1, printWidth) },
    // addressLine2 && { appendBitmapText: alignCenter(addressLine2, printWidth) },
    { appendBitmapText: alignCenter(addressCity, printWidth) },
    { appendBitmapText: alignCenter(addressCounty, printWidth) },
    { appendBitmapText: alignCenter(addressPostcode, printWidth) },
    { appendBitmapText: ' ' },
    {
      appendBitmapText: alignLeftRight(`Date: ${dayjs().format('DD/MM/YYYY')}`, `Time: ${dayjs().format('HH:mm')}`, printWidth, Math.round(printWidth / 2)),
    },
    { appendBitmapText: ' ' },
    ...commands,
  ];
};
