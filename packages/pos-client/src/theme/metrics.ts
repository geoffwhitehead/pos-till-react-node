import { map } from 'lodash';
import { scale } from '../utils/scaling';

const spaces = [0, 1, 2, 4, 8, 16, 20, 24, 28, 32, 36, 40];

export const spacing = map(spaces, scale);
