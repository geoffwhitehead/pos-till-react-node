import { moderateScale } from '../utils/scaling';
//              0  1  2  3  4  5   6   7   8   9   10  11
export const spaces = [0, 1, 2, 4, 8, 16, 20, 24, 28, 32, 36, 40];

export const spacing = spaces.map(moderateScale);
