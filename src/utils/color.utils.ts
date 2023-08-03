export function convertHexToRgb(hex: string) {
  const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  const matches = hex.match(regex)

  if (!matches) {
    throw new Error('Invalid hex color string format')
  }

  const red = parseInt(matches[1], 16)
  const green = parseInt(matches[2], 16)
  const blue = parseInt(matches[3], 16)

  return `rgb(${red}, ${green}, ${blue})`
}
