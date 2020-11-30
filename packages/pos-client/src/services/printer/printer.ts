import { Printers, StarPRNT } from 'react-native-star-prnt';
import { Printer } from '../../models';
import { toast } from '../../utils/toast';

export async function portDiscovery(): Promise<Printers> {
  try {
    let printers = await StarPRNT.portDiscovery('All');
    return printers;
  } catch (e) {
    console.error(e);
    toast({
      message: `Failed to discover printers. ${e}`,
    });
  }
}

export async function print(commands: any[], printer: Printer, openDrawer: boolean = false) {
  commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  openDrawer && commands.push({ openCashDrawer: 1 });

  try {
    await StarPRNT.print(printer.emulation, commands, printer.address);
    return { success: true };
  } catch (e) {
    toast({
      message: `Failed to print. ${e}`,
    });
    return { success: false, error: e };
  }
}
