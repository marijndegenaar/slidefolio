/** @type {import('tailwindcss').Config} */
const fractionMap = {}
const denominators = [2, 3, 4, 5, 6, 8, 10, 12]
denominators.forEach((d) => {
  for (let n = 1; n < d; n++) {
    fractionMap[`${n}x${d}`] = `${(n / d) * 100}%`
  }
})

module.exports = {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx}'],
  separator: '_',
  theme: {
    extend: {
      width: fractionMap,
      height: fractionMap,
      minWidth: fractionMap,
      minHeight: fractionMap,
      maxWidth: fractionMap,
      maxHeight: fractionMap,
      top: fractionMap,
      right: fractionMap,
      bottom: fractionMap,
      left: fractionMap,
      inset: fractionMap,
      translate: {
        x: fractionMap,
        y: fractionMap,
      },
      aspectRatio: {
        wide: '16/7',
        '4x3': '4/3',
        '3x4': '3/4',
      },
    },
  },
  plugins: [],
}
