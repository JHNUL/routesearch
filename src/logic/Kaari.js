class Kaari {
  constructor(alku, loppu, paino) {
    this._alku = alku
    this._loppu = loppu
    this._paino = paino
  }
  get paino() {
    return this._paino
  }
  get alku() {
    return this._alku
  }
  get loppu() {
    return this._loppu
  }
}

module.exports = { Kaari }