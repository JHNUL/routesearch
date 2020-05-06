const express = require('express')
const { pysakkiHakemisto, tiet } = require('./util/constants')
const Reittihaku = require('./logic/Reittihaku')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/api/stops', (req, res) => {
  res.status(200).json({
    pysakit: Object.keys(pysakkiHakemisto),
    tiet,
  })
})

app.get('/api/search', (req, res) => {
  const { from, to } = req.query
  try {
    const reitti = new Reittihaku(tiet, pysakkiHakemisto)
    const haku = reitti.haeReitti(from, to)
    res.status(200).json(haku)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

app.use(express.static('dist'))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
