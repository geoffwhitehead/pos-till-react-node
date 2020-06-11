import { StarPRNT } from 'react-native-star-prnt';
import { Toast } from '../../core';
import { Printer } from '../../models';

// export const RECEIPT_WIDTH = 15; // TODO: move to settings - printer width
// export const RECEIPT_WIDTH = 39; // TODO: move to settings - printer width
// const port = 'TCP:192.168.1.78';
// const kPort = 'TCP:192.168.1.84';
// const kEmulation = 'StarDotImpact'
// const rEmulation = 'StarGraphic'



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
    console.log('printer', printer)
    await StarPRNT.print(printer.emulation, commands, printer.address);
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
