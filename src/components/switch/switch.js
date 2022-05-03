/*! (c) 2022 Harurow */

/**
 * スイッチの形したチェックボックス
 */
class MySwitch extends HTMLElement {
  /**
   * 要素が生成されました
   */
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  /**
   * ブラウザは要素が document に追加された時にこれを呼びます
   * (要素が繰り返し追加/削除される場合、何度も呼ばれます)
   */
  connectedCallback () {
    this.render()
  }

  /**
   * 監視対象の属性名の配列
   */
  static observedtAttributesTargets = ['checked', 'value', 'disabled', 'indeterminate']

  /**
   * 変更を監視する属性名の配列を取得する
   */
  static get observedAttributes () {
    return MySwitch.observedtAttributesTargets
  }

  /**
   * observedAttributesで挙げたいずれかの属性が変更されたときに呼ばれま
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (MySwitch.observedtAttributesTargets.includes(name)) {
      this.render()
    }
  }

  get value () {
    return this.getAttribute('value') ?? 'on'
  }

   set value (v) {
    this.setAttribute('value', v)
  }

  get indeterminate () {
    return this.hasAttribute('indeterminate')
  }

  set indeterminate (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('indeterminate', undefined)
    } else {
      this.removeAttribute('indeterminate')
    }
  }

  get checked () {
    return this.hasAttribute('checked')
  }

  set checked (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('checked', undefined)
    } else {
      this.removeAttribute('checked')
    }
  }

  get disabled () {
    return this.hasAttribute('disabled')
  }

  set disabled (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('disabled', undefined)
    } else {
      this.removeAttribute('disabled')
    }
  }

  /**
   * レンダリング
   */
  render () {
    const $ = (s) => document.querySelector(s)
    const checked = this.checked
    const disabled = this.disabled

    const color = this.getAttribute('color') ?? 'primary'
    const checkBoxAttr = (checked ? ' checked' : '')
                       + (disabled ? ' disabled' : '')
    const rootCss = disabled ? ' style="opacity: .5;"': ''
    const labelCss = disabled ? ' style="cursor: default"' : ''

    this.shadow.innerHTML = `<style
      >@import 'components/switch/style.css'</style
      ><span id="root" class="${color}"${rootCss}
        ><label for="checkbox" id="switch"${labelCss}
          ><input id="checkbox" type="checkbox"${checkBoxAttr}></input
          ><span id="slider"></span
          ><span id="effects"></span
          ><span id="thumbs"></span
        ></label
      ></span>`

    const checkbox = this.shadow.querySelector('#checkbox')

    if (this.indeterminate) {
      checkbox.indeterminate = true
    }

    checkbox.addEventListener('change', this.fireChangeEvent)
  }

  fireChangeEvent(e) {
    if (e.composed === false) {
      const event = new CustomEvent('change', {
        composed: true,
      })
      this.dispatchEvent(event)
    }
  }
}

customElements.define('my-switch', MySwitch)
