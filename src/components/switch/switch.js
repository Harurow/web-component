/*! (c) 2022 Harurow */

/**
 * スイッチの形したチェックボックス
 */
class MySwitch extends HTMLElement {
  /**
   * コンポーネント作成
   */
  constructor () {
    super()

    // shadow domにアタッチ
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  /**
   * コンポーネントが document に追加したタイミングで呼び出される。
   * 追加、削除を繰り返すとその度に呼び出される。
   */
  connectedCallback () {
    this.render()
  }

  /**
   * コンポーネントが document から削除されたときに呼び出されます。
   * 追加、削除を繰り返すとその度に呼び出される。
   */
  disconnectedCallback () {
  }

  /**
   * 監視対象のタグ名を配列で返す
   */
  static get observedAttributes () {
    return ['checked', 'value', 'disabled', 'indeterminate']
  }

  /**
   * observedAttributes で列挙した属性が変更されたときに呼び出される
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback (name, oldValue, newValue) {
    // 監視属性の変更に合わせて再レンダリング
    this.render()
  }

  /**
   * コンポーネントが新しい document に移動 (adoptNode)した場合に呼び出される
   */
  adoptedCallback() {
  }

  /**
   * レンダリング
   */
  render () {
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

  /**
   * value属性の取得
   */
  get value () {
    return this.getAttribute('value') ?? 'on'
  }

  /**
   * value属性の設定
   */
  set value (v) {
    this.setAttribute('value', v)
  }

  /**
   * indeterminate属性の取得
   */
  get indeterminate () {
    return this.hasAttribute('indeterminate')
  }

  /**
   * indeterminate属性の設定
   */
  set indeterminate (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('indeterminate', undefined)
    } else {
      this.removeAttribute('indeterminate')
    }
  }

  /**
   * checked属性の取得
   */
  get checked () {
    return this.hasAttribute('checked')
  }

  /**
   * checked属性の設定
   */
  set checked (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('checked', undefined)
    } else {
      this.removeAttribute('checked')
    }
  }

  /**
   * disabled属性の取得
   */
  get disabled () {
    return this.hasAttribute('disabled')
  }

  /**
   * disabled属性の設定
   */
  set disabled (v) {
    const b = Boolean(v)
    if (b) {
      this.setAttribute('disabled', undefined)
    } else {
      this.removeAttribute('disabled')
    }
  }

  /**
   * changeイベントの発行
   * @param {Event} e
   */
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
