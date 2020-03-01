import { StarPRNT } from 'react-native-star-prnt';

let commands = [];

commands.push({ appendBitmapText: 'Star Clothing Boutique\n' + '123 Star Road\n' + 'City, State 12345\n' + '\n' });
commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });

export async function print() {
  try {
    var printResult = await StarPRNT.print('StarGraphic', commands, 'USB');
    console.log(printResult); // Success!
  } catch (e) {
    console.error(e);
  }
}
