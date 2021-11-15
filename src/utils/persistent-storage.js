import ms from './memory-storage'

class PersistentStorage {
  prefix
  storage

  constructor(prefix) {
    this.prefix = `${prefix}_app`
    this.storage = window.localStorage ?? ms
  }

  _set(key, value) {
    window.localStorage.clear
    const st = this._get()
    st[key] = value
    this.storage.setItem(this.prefix, JSON.stringify(st))
  }

  _get(key) {
    let result = this.storage.getItem(this.prefix)
    result = JSON.parse(result) ?? {}
    return key ? result[key] : result
  }

  _remove(key) {
    const st = this._get()
    if (key in st) {
      delete st[key]
    }
    this.storage.setItem(this.prefix, JSON.stringify(st))
  }

  set(key, value) {
    this._set(key, value)
  }

  get(key, def) {
    return this._get(key) || def
  }

  remove(key) {
    this._remove(key)
  }
}

export default new PersistentStorage(process.env.VUE_APP_NAME_SPACE)
