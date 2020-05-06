const Reittihaku = require('./logic/Reittihaku')

const reitti = new Reittihaku()
const res = reitti.haeReitti('A', 'E')
console.log('<< Line 5 at server.js >> ', res)