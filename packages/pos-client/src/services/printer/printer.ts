import { StarPRNT } from 'react-native-star-prnt';
import { Toast } from '../../core';
import { Printer } from '../../models';

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
    await StarPRNT.print(printer.emulation, commands, printer.address);
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
