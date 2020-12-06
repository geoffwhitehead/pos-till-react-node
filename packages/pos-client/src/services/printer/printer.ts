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

type PrintProps = { commands: any[]; printer: Printer; openDrawer?: boolean; onFinished?: (success: boolean) => void };

export async function print({ commands, printer, openDrawer = false, onFinished }: PrintProps) {
  commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  openDrawer && commands.push({ openCashDrawer: 1 });

  try {
    await StarPRNT.print(printer.emulation, commands, printer.address);
    onFinished && onFinished(true);
    return { success: true };
  } catch (e) {
    toast({
      message: `Failed to print. ${e}`,
    });
    onFinished && onFinished(false);
    return { success: false, error: e };
  }
}
