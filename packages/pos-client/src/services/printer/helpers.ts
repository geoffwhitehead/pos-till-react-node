export const alignLeftRight = (left: string, right: string = '', receiptWidth:number, rightWidth = 12) => {
    const leftWidth = Math.max(receiptWidth - rightWidth, 0);
    const lines = Math.ceil(left.length / leftWidth);
    const spaces = Math.max(receiptWidth * lines - right.length - left.length, 0);
    return `${left}${' '.repeat(spaces)}${right}`;
  };
  
  export const alignLeftRightSingle = (left: string, right: string, width) => {
    const spaces = Math.max(width - left.length - right.length, 0)
    return `${left}${' '.repeat(spaces)}${right}`;
  }
  
  export const alignCenter = (string:string, receiptWidth:number) => {
    const leftSpaces = Math.max(Math.floor(receiptWidth / 2 - string.length / 2), 0);
    return `${' '.repeat(leftSpaces)}${string}`;
  };
  
  export const alignRight = (string: string, receiptWidth: number) => {
    const leftSpaces = Math.max(Math.floor(receiptWidth - string.length), 0);
    return `${' '.repeat(leftSpaces)}${string}`;
  };
  
  export const divider = (receiptWidth:number) => ({ appendBitmapText: '-'.repeat(receiptWidth) });
  export const starDivider = (receiptWidth: number) => ({ appendBitmapText: '*'.repeat(receiptWidth) });
  export const newLine = { appendBitmapText: ' \n' };
  
  export const addHeader = (c: any[], header: string, printWidth: number): void => {
    c.push({ appendBitmapText: ' ' });
    c.push({ appendBitmapText: header });
    c.push(divider(printWidth));
  };