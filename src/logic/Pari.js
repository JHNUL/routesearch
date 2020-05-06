class Pari {
  constructor(etaisyys, solmu) {
    this._etaisyys = etaisyys
    this._solmu = solmu
  }

  get etaisyys() {
    return this._etaisyys
  }

  get solmu() {
    return this._solmu
  }
}


module.exports = { Pari }