function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function containsNumberObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].number === obj.number) {
      return true;
    }
  }

  return false;
}
export {capitalizeFirstLetter, containsNumberObject};
