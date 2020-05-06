const { pysakkiHakemisto, pysakkiTaulukko, tiet } = require('../util/constants')
const { Kaari } = require('./Kaari')
const { Pari } = require('./Pari')

class Reittihaku {

  constructor() {
    this.kaarilista = Array(Object.keys(pysakkiHakemisto).length + 1).fill([])
    this.vanhemmat = Array(Object.keys(pysakkiHakemisto).length + 1).fill(-1)
    this.reitti = []
  }

  _initData() {
    for (const tie of tiet) {
      const alku = pysakkiHakemisto[tie.mista]
      const loppu = pysakkiHakemisto[tie.mihin]
      this.kaarilista[alku] = [...this.kaarilista[alku], new Kaari(alku, loppu, tie.kesto)]
      this.kaarilista[loppu] = [...this.kaarilista[loppu], new Kaari(loppu, alku, tie.kesto)]
    }
  }

  _rekonstruoiReitti(solmu) {
    this.reitti.unshift(pysakkiTaulukko[solmu])
    if (this.vanhemmat[solmu] === -1) {
      return
    } else {
      this._rekonstruoiReitti(this.vanhemmat[solmu])
    }
  }

  haeReitti(mista, mihin) {
    this._initData()
    const alku = pysakkiHakemisto[mista]
    const loppu = pysakkiHakemisto[mihin]
    const minimikeko = [] // kek
    const etaisyys = Array(Object.keys(pysakkiHakemisto).length + 1).fill(Number.MAX_SAFE_INTEGER)
    const kaydyt = Array(Object.keys(pysakkiHakemisto).length + 1).fill(false)
    etaisyys[alku] = 0
    this.vanhemmat[alku] = -1
    minimikeko.push(new Pari(0, alku))
    while (minimikeko.length > 0) {
      const solmu = minimikeko.pop().solmu
      if (kaydyt[solmu]) continue
      kaydyt[solmu] = true
      for (const kaari of this.kaarilista[solmu]) {
        const nykyinenEtaisyys = etaisyys[kaari.loppu]
        const uusiEtaisyys = etaisyys[solmu] + kaari.paino
        if (uusiEtaisyys < nykyinenEtaisyys) {
          etaisyys[kaari.loppu] = uusiEtaisyys
          this.vanhemmat[kaari.loppu] = solmu
          minimikeko.push(new Pari(uusiEtaisyys, kaari.loppu))
          minimikeko.sort((p1, p2) => p2.etaisyys - p1.etaisyys) // topkek
        }
      }
    }
    const lyhinReitti = etaisyys[loppu] == Number.MAX_SAFE_INTEGER ? -1 : etaisyys[loppu]
    if (lyhinReitti < 0) { // ei yhteyttä solmujen välillä
      return null
    }
    this._rekonstruoiReitti(loppu)
    return {
      lyhinReitti,
      reitti: this.reitti
    }
  }

}

module.exports = Reittihaku