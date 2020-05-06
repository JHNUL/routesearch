const { Kaari } = require('./Kaari')
const { Pari } = require('./Pari')

class Reittihaku {

  constructor(tiet, pysakkiHakemisto) {
    this._kaarilista = Array(Object.keys(pysakkiHakemisto).length + 1).fill([])
    this._vanhemmat = Array(Object.keys(pysakkiHakemisto).length + 1).fill(-1)
    this._reitti = []
    this._pysakkiHakemisto = pysakkiHakemisto
    this._pysakkiTaulukko = [null, ...Object.keys(pysakkiHakemisto)] // pidä ensimmäinen arvo indeksissä 1
    this._alusta(tiet)
  }

  _alusta(tiet) {
    for (const tie of tiet) {
      const alku = this._pysakkiHakemisto[tie.mista]
      const loppu = this._pysakkiHakemisto[tie.mihin]
      this._kaarilista[alku] = [...this._kaarilista[alku], new Kaari(alku, loppu, tie.kesto)]
      this._kaarilista[loppu] = [...this._kaarilista[loppu], new Kaari(loppu, alku, tie.kesto)]
    }
  }

  /* luo taulukko kuljetuista pysäkeistä */
  _rekonstruoiReitti(solmu) {
    this._reitti.unshift(this._pysakkiTaulukko[solmu])
    if (this._vanhemmat[solmu] === -1) {
      return
    } else {
      this._rekonstruoiReitti(this._vanhemmat[solmu])
    }
  }

  /* päämetodi dijkstran algoritmilla, koska kaaria on niin vähän on tässä
  oikaistu käyttämällä minimikeon sijaan ihan basic taulukkoa ja ylläpitämällä
  järjestystä taulukon omalla sorttausmetodilla */
  haeReitti(mista, mihin) {
    const alku = this._pysakkiHakemisto[mista]
    const loppu = this._pysakkiHakemisto[mihin]
    if (alku === undefined || loppu === undefined) throw Error('Pysäkkiä ei olemassa')
    const minimikeko = [] // kek
    const etaisyys = Array(Object.keys(this._pysakkiHakemisto).length + 1).fill(Number.MAX_SAFE_INTEGER)
    const kaydyt = Array(Object.keys(this._pysakkiHakemisto).length + 1).fill(false)
    etaisyys[alku] = 0
    this._vanhemmat[alku] = -1
    minimikeko.push(new Pari(0, alku))
    while (minimikeko.length > 0) {
      const solmu = minimikeko.pop().solmu
      if (kaydyt[solmu]) continue
      kaydyt[solmu] = true
      for (const kaari of this._kaarilista[solmu]) {
        const nykyinenEtaisyys = etaisyys[kaari.loppu]
        const uusiEtaisyys = etaisyys[solmu] + kaari.paino
        if (uusiEtaisyys < nykyinenEtaisyys) {
          etaisyys[kaari.loppu] = uusiEtaisyys
          this._vanhemmat[kaari.loppu] = solmu
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
      reitti: this._reitti
    }
  }

}

module.exports = Reittihaku