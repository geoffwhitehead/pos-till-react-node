import { alignCenter, alignLeftRight } from './helpers';
import { StarPRNT } from 'react-native-star-prnt';
import dayjs from 'dayjs';
import { Printer } from '../../models';

const date = dayjs().format('DD/MM/YYYY');
const time = dayjs().format('HH:mm');

export const receiptTempate = (commands: any[], org, printer: Printer) => {
  return [
    { appendCodePage: StarPRNT.CodePageType.CP858 },
    { appendEncoding: StarPRNT.Encoding.USASCII },
    { appendInternational: StarPRNT.InternationalType.UK },
    { appendFontStyle: 'B' },
    { appendBitmapText: alignCenter(org.name, printer.printWidth) },
    { appendBitmapText: alignCenter(org.line1, printer.printWidth) },
    { appendBitmapText: alignCenter(org.line2, printer.printWidth) },
    { appendBitmapText: alignCenter(org.city, printer.printWidth) },
    { appendBitmapText: alignCenter(org.county, printer.printWidth) },
    { appendBitmapText: alignCenter(org.postcode, printer.printWidth) },
    { appendBitmapText: ' ' },
    {
      appendBitmapText: alignLeftRight(
        `Date: ${date}`,
        `Time: ${time}`,
        printer.printWidth,
        Math.round(printer.printWidth / 2),
      ),
    },
    { appendBitmapText: ' ' },
    ...commands,
  ];
};
