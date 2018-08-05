export default function mapToZero(obj) {
  let ret = {};
  for(let key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      ret[key] = 0;
    }
  }
  return ret;
}