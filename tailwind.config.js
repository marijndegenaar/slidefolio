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
      // Opacity variants with "-" so Pug doesn't choke on "/" in class names
      backgroundColor: {
        'black-5': 'rgb(0 0 0 / 0.05)',
        'black-10': 'rgb(0 0 0 / 0.1)',
        'black-20': 'rgb(0 0 0 / 0.2)',
        'black-40': 'rgb(0 0 0 / 0.4)',
        'black-60': 'rgb(0 0 0 / 0.6)',
        'black-80': 'rgb(0 0 0 / 0.8)',
        'black-90': 'rgb(0 0 0 / 0.9)',
        'white-5': 'rgb(255 255 255 / 0.05)',
        'white-10': 'rgb(255 255 255 / 0.1)',
        'white-20': 'rgb(255 255 255 / 0.2)',
        'white-40': 'rgb(255 255 255 / 0.4)',
      },
    },
  },
  plugins: [],
}
