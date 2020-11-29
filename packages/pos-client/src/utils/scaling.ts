import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on landscape ipad air 2
const guidelineBaseWidth = 2224;
const guidelineBaseHeight = 1668;

console.log('width', width);
console.log('heighaaat', height);
const scale = size => {
  console.log('width', width);
  console.log('height', height);
  console.log('size', size);
  return (width / guidelineBaseWidth) * size;
};
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };
