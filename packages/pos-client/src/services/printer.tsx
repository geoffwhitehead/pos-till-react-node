import { StarPRNT, AlignmentPosition } from 'react-native-star-prnt';
import { BillProps } from './schemas';
import { formatNumber } from '../utils';

// commands.push({ appendBitmapText: 'Star Clothing Boutique\n' + '123 Star Road\n' + 'City, State 12345\n' + '\n' });
// commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });

export async function print(bill: BillProps) {
  console.log('............... bill', bill);

  bill.items.map(i => {
    console.log('i: ', i);
  });
  const port = 'TCP:192.168.1.78';
  let c = [];
  c.push({ appendCodePage: StarPRNT.CodePageType.CP858 });
  c.push({ appendEncoding: StarPRNT.Encoding.USASCII });
  c.push({ appendInternational: StarPRNT.InternationalType.UK });
  c.push({ appendBitmapText: new Date().toString() });

  bill.items.map(item => {
    c.push({ appendBitmapText: item.name });
    // c.push({ appendAlignment: AlignmentPosition.Right, appendBytes: [0x9c] });
    // c.push({ appendAlignment: AlignmentPosition.Right, data: `${formatNumber(item.price)}\n` });
  });

  c.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  try {
    // const printers = await portDiscovery();
    // const printer = printers[0].portName;
    // console.log('!!!!!!!!!!!! printer', printer);
    var printResult = await StarPRNT.print('StarGraphic', c, port);
    console.log(printResult); // Success!
  } catch (e) {
    console.error(e);
  }
}
