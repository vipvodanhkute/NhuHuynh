export const equalString = (a, b) => {
  if (a.length === b.length) {
    return a > b ? 1 : 0
  }
  return a.length - b.length
}

export const appendLeadingZeroes = (n) => {
  if (n <= 9) {
    return `0${n}`;
  }
  return n
}
