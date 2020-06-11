export const alignLeftRight = (left: string, right: string = '', receiptWidth:number, rightWidth = 12) => {
    const leftWidth = receiptWidth - rightWidth;
    const lines = Math.ceil(left.length / leftWidth);
    const spaces = receiptWidth * lines - right.length - left.length;
    return `${left}${' '.repeat(spaces)}${right}`;
  };
  
  export const alignLeftRightSingle = (left: string, right: string, width) => {
    const spaces = width - left.length - right.length
    return `${left}${' '.repeat(spaces)}${right}`;
  }
  
  export const alignCenter = (string:string, receiptWidth:number) => {
    const leftSpaces = Math.floor(receiptWidth / 2 - string.length / 2);
    return `${' '.repeat(leftSpaces)}${string}`;
  };
  
  export const alignRight = (string: string, receiptWidth: number) => {
    const leftSpaces = Math.floor(receiptWidth - string.length);
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