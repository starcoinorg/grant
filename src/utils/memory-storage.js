const storage = {}

class MemoryStorage {
  get length() {
    return Object.keys(this.storage).length
  }

  get storage() {
    return storage
  }

  getItem(key) {
    return key in this.storage ? this.storage[key] : null
  }

  setItem(key, value) {
    this.storage[key] = value
  }

  removeItem(key) {
    if (key in this.storage) {
      delete this.storage[key]
    }
  }

  clear() {
    const keys = Object.keys(this.storage)

    for (let i = 0; i <= keys.length; i++) {
      try {
        delete this.storage[keys[i]]
      } catch {
        // pass
      }
    }
  }
}

export default new MemoryStorage()
