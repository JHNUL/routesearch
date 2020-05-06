const Reittihaku = require('../src/logic/Reittihaku')

describe('Reittihaku', () => {

  let defaultTiet, defaultHakemisto
  beforeEach(() => {
    defaultTiet = [
      {mista: 'A', mihin: 'B', kesto: 2},
      {mista: 'B', mihin: 'C', kesto: 1},
      {mista: 'A', mihin: 'D', kesto: 1},
      {mista: 'D', mihin: 'E', kesto: 1},
      {mista: 'E', mihin: 'F', kesto: 1},
      {mista: 'H', mihin: 'I', kesto: 1} // irtonainen reitti
    ]
    defaultHakemisto = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, H: 7, I: 8 }
  })

  it('Palauttaa oikein samalla solmulla haettaessa', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku.haeReitti('A', 'A')).toEqual({
      lyhinReitti: 0,
      reitti: ['A']
    })
  })

  it('Heittää virheen kun haetaan olemattomalla solmulla', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(() => haku.haeReitti('A', 'K')).toThrow('Pysäkkiä ei olemassa')
  })

  it('Palauttaa null kun ei yhteyttä ei löydy', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku.haeReitti('A', 'H')).toBeNull()
  })

  it('Palauttaa lyhimmän reitin kahden solmun välillä A D', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku.haeReitti('A', 'D')).toEqual({
      lyhinReitti: 1,
      reitti: ['A', 'D']
    })
  })

  it('Palauttaa lyhimmän reitin kahden solmun välillä E A', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku.haeReitti('E', 'A')).toEqual({
      lyhinReitti: 2,
      reitti: ['E', 'D', 'A']
    })
  })

  it('Palauttaa saman pituuden ja vastakkaisen reittijärjestyksen', () => {    
    const haku = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku.haeReitti('A', 'F')).toEqual({
      lyhinReitti: 3,
      reitti: ['A', 'D', 'E', 'F']
    })
    const haku2 = new Reittihaku(defaultTiet, defaultHakemisto)
    expect(haku2.haeReitti('F', 'A')).toEqual({
      lyhinReitti: 3,
      reitti: ['F', 'E', 'D', 'A']
    })
  })

})
