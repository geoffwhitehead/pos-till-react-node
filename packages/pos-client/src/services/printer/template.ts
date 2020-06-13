import { alignCenter, alignLeftRight } from './helpers';
import { StarPRNT } from 'react-native-star-prnt';
import dayjs from 'dayjs';
import { Printer } from '../../models';

const date = dayjs().format('DD/MM/YYYY');
const time = dayjs().format('HH:mm');

export const receiptTempate = (commands: any[], org, printWidth: number) => {
  return [
    { appendCodePage: StarPRNT.CodePageType.CP858 },
    { appendEncoding: StarPRNT.Encoding.USASCII },
    { appendInternational: StarPRNT.InternationalType.UK },
    { appendFontStyle: 'B' },
    { appendBitmapText: alignCenter(org.name, printWidth) },
    { appendBitmapText: alignCenter(org.line1, printWidth) },
    { appendBitmapText: alignCenter(org.line2, printWidth) },
    { appendBitmapText: alignCenter(org.city, printWidth) },
    { appendBitmapText: alignCenter(org.county, printWidth) },
    { appendBitmapText: alignCenter(org.postcode, printWidth) },
    { appendBitmapText: ' ' },
    {
      appendBitmapText: alignLeftRight(
        `Date: ${date}`,
        `Time: ${time}`,
        printWidth,
        Math.round(printWidth / 2),
      ),
    },
    { appendBitmapText: ' ' },
    ...commands,
  ];
};
