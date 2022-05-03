/*! (c) 2022 Harurow */

/**
 * 定義された色からRGBの色定義を分けて追加定義
 */

/**
 * RGB値からHSLを求める
 * @param {{
 *    r: number,
 *    g: number,
 *    b: number,
 *    a: number
 * }}
 * @returns {{
 *  h: number,
 *  s: number,
 *  l: number,
 *  a: number
 * }}
 */
const rgba2hsla = ({ r, g, b, a }) => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const hsla = {
    h: 0,
    s: 0,
    l: (max + min) / 2,
    a
  }
  const diff = max - min

  if (min !== max) {
    if (max === r) {
      hsla.h = 60 * (g - b) / diff
    } else if (max === g) {
      hsla.h = 60 * (b - r) / diff + 120
    } else if (max === b) {
      hsla.h = 60 * (r - g) / diff + 240
    }
  }

  hsla.s = diff / ((hsla.l <= 127) ? (max + min) : 510 - diff)

  if (hsla.h < 0) {
    hsla.h += 360
  }

  hsla.h = Math.round(hsla.h)
  hsla.s = Math.round(hsla.s * 100)
  hsla.l = Math.round((hsla.l * 100 / 255))
  hsla.a = hsla.a / 255

  return hsla
}

/**
 * HSLからRGBへ変換
 * @param {{
 *  h: number,
 *  s: number,
 *  l: number,
 *  a: number
 * }}
 */
const hsla2rgba = ({ h, s, l, a }) => {
  let max, min
  const rgb = { r: 0, g: 0, b: 0, a: a * 2.55 }

  if (h === 360) {
    h = 0
  }

  if (l <= 49) {
    max = 2.55 * (l + l * (s / 100))
    min = 2.55 * (l - l * (s / 100))
  } else {
    max = 2.55 * (l + (100 - l) * (s / 100))
    min = 2.55 * (l - (100 - l) * (s / 100))
  }

  if (h < 60) {
    rgb.r = max
    rgb.g = min + (max - min) * (h / 60)
    rgb.b = min
  } else if (h >= 60 && h < 120) {
    rgb.r = min + (max - min) * ((120 - h) / 60)
    rgb.g = max
    rgb.b = min
  } else if (h >= 120 && h < 180) {
    rgb.r = min
    rgb.g = max
    rgb.b = min + (max - min) * ((h - 120) / 60)
  } else if (h >= 180 && h < 240) {
    rgb.r = min
    rgb.g = min + (max - min) * ((240 - h) / 60)
    rgb.b = max
  } else if (h >= 240 && h < 300) {
    rgb.r = min + (max - min) * ((h - 240) / 60)
    rgb.g = min
    rgb.b = max
  } else if (h >= 300 && h < 360) {
    rgb.r = max
    rgb.g = min
    rgb.b = min + (max - min) * ((360 - h) / 60)
  }

  rgb.r = Math.round(rgb.r)
  rgb.g = Math.round(rgb.g)
  rgb.b = Math.round(rgb.b)
  rgb.a = Math.round(rgb.a)
  return rgb
}

/**
 * 色のカスタムプロパティを拡張する
 * 指定した名前のプロパティ(RGB)から以下のプロパティを追加します
 * -rgb, -contrast, -contrast-rgb, -h, -s, -l
 * @param {string} name
 */
const extendCustomProperty = (name) => {
  const $ = (s) => document.querySelector(s)

  const getColor = (name) => {
    const rawValue = getComputedStyle($(':root')).getPropertyValue(`--${name}`).trim()
    const re = /^(#?)([0-9a-f]{3,8})(;?)$/i
    if (re.test(rawValue)) {
      const hexValue = rawValue.replace(re, '$2')
      let rr, gg, bb, aa
      switch (hexValue.length) {
        case 3:
        case 4:
          rr = hexValue.substring(0, 1)
          gg = hexValue.substring(1, 2)
          bb = hexValue.substring(2, 3)
          aa = (hexValue.length === 4) ? hexValue.substring(3, 4) : 'f'
          rr += rr
          gg += gg
          bb += bb
          aa += aa
          break
        case 6:
        case 8:
          rr = hexValue.substring(0, 2)
          gg = hexValue.substring(2, 4)
          bb = hexValue.substring(4, 6)
          aa = (hexValue.length === 8) ? hexValue.substring(6, 8) : 'ff'
          break
        default:
          return null
      }
      return {
        r: parseInt(rr, 16),
        g: parseInt(gg, 16),
        b: parseInt(bb, 16),
        a: parseInt(aa, 16),
        rr,
        gg,
        bb,
        aa
      }
    }
    return null
  }

  const rgba = getColor(name)
  const hsla = rgba2hsla(rgba)

  const cssText = `--${name}-rgb:${rgba.r},${rgba.g},${rgba.b};` +
        `--${name}-contrast:${hsla.l >= 50 ? '#000000' : '#ffffff'};` +
        `--${name}-contrast-rgb:${hsla.l >= 50 ? '0,0,0' : '255,255,255'};` +
        `--${name}-h:${hsla.h};` +
        `--${name}-s:${hsla.s}%;` +
        `--${name}-l:${hsla.l}%;`
  
  // .cssに直接貼り付けたい時は以下をコメント解除して console.log からコピペして利用
  // const forPaste = `  /* ${name} */
  // --${name}: #${rgba.rr}${rgba.gg}${rgba.bb}${rgba.aa};\n`
  // + cssText.replace(/;/g, ';\n').replace(/--/g, '  --').replace(/:/g, ':')
  // console.log(forPaste)

  return cssText
}

(() => {
  console.log('extend custom properties')

  const target_property_names = [
    'primary',
    'primary-light',
    'primary-dark',
    'secondary',
    'secondary-light',
    'secondary-dark',
  ]

  // HTMLにStyleタグを追加しそこに変数追加
  const style = document.createElement('style', {})
  style.setAttribute('x-extend-custom-properties', '')
  style.innerHTML = ':root {' +
    target_property_names
      .map(extendCustomProperty)
      .join('') +
    '}'

  document.querySelector(':root head').append(style)
})()
