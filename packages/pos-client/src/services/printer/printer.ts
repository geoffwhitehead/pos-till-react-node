import { StarPRNT } from 'react-native-star-prnt';
import { Toast } from '../../core';
import { Printer } from '../../models';

export const RECEIPT_WIDTH = 15; // TODO: move to settings - printer width
// export const RECEIPT_WIDTH = 39; // TODO: move to settings - printer width
const port = 'TCP:192.168.1.78';
const kPort = 'TCP:192.168.1.84';
const kEmulation = 'StarDotImpact'
const rEmulation = 'StarGraphic'

export const alignLeftRight = (left: string, right: string = '', rightWidth = 12) => {
  const leftWidth = RECEIPT_WIDTH - rightWidth;
  const lines = Math.ceil(left.length / leftWidth);
  const spaces = RECEIPT_WIDTH * lines - right.length - left.length;
  return `${left}${' '.repeat(spaces)}${right}`;
};

export const alignLeftRightSingle = (left: string, right: string, width) => {
  const spaces = width - left.length - right.length
  return `${left}${' '.repeat(spaces)}${right}`;
}

export const alignCenter = string => {
  const leftSpaces = Math.floor(RECEIPT_WIDTH / 2 - string.length / 2);
  return `${' '.repeat(leftSpaces)}${string}`;
};

export const alignRight = string => {
  const leftSpaces = Math.floor(RECEIPT_WIDTH - string.length);
  return `${' '.repeat(leftSpaces)}${string}`;
};

export const divider = { appendBitmapText: '-'.repeat(RECEIPT_WIDTH) };
export const starDivider = { appendBitmapText: '*'.repeat(RECEIPT_WIDTH) };
export const newLine = { appendBitmapText: ' \n' };

export const addHeader = (c: any[], header: string): void => {
  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: header });
  c.push(divider);
};

export async function portDiscovery() {
  try {
    let printers = await StarPRNT.portDiscovery('All');
    console.log(printers);
  } catch (e) {
    console.error(e);
  }
}

export async function print(commands: any[], printer: Printer, openDrawer: boolean = false) {
  // const x = await portDiscovery();

  // console.log('x', x);
  commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  openDrawer && commands.push({ openCashDrawer: 1 });
  try {
    console.log('start');
    await StarPRNT.print(kEmulation, commands, printer.address || kPort);
    console.log('end');
    return { success: true };
  } catch (e) {
    Toast.show({
      text: `Failed to print. Check connection...`,
      buttonText: 'Okay',
      duration: 5000,
      type: 'danger',
    });
    return { success: false, error: e };
  }
}
