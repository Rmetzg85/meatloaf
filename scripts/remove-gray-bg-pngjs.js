const fs = require('fs')
const { PNG } = require('pngjs')

const publicDir = __dirname + '/../public'
const logoPath = publicDir + '/logo.png'
const backupPath = publicDir + '/logo.orig.png'
const outPath = publicDir + '/logo.png'

if (!fs.existsSync(logoPath)) {
  console.error('logo.png not found in public folder')
  process.exit(1)
}

if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(logoPath, backupPath)
  console.log('Backed up original to logo.orig.png')
} else {
  console.log('Backup already exists at logo.orig.png')
}

fs.createReadStream(logoPath)
  .pipe(new PNG())
  .on('parsed', function() {
    // sample top-left and nearby pixels
    const sampleCoords = [ [0,0], [1,0], [0,1], [2,0], [0,2] ]
    const samples = []
    for (const [x,y] of sampleCoords) {
      if (x < this.width && y < this.height) {
        const idx = (this.width * y + x) << 2
        samples.push({ r: this.data[idx], g: this.data[idx+1], b: this.data[idx+2] })
      }
    }

    const avg = samples.reduce((acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }), { r:0,g:0,b:0 })
    const bg = { r: Math.round(avg.r / samples.length), g: Math.round(avg.g / samples.length), b: Math.round(avg.b / samples.length) }
    console.log('Detected background color:', bg)

    function colorDist(a,b) { return Math.sqrt((a.r-b.r)**2 + (a.g-b.g)**2 + (a.b-b.b)**2) }
    const threshold = 30

    for (let y=0;y<this.height;y++){
      for (let x=0;x<this.width;x++){
        const idx = (this.width * y + x) << 2
        const r = this.data[idx]
        const g = this.data[idx+1]
        const b = this.data[idx+2]
        const d = colorDist({r,g,b}, bg)
        if (d < threshold) {
          this.data[idx+3] = 0
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outPath)).on('finish', ()=>{
      console.log('Wrote transparent logo to', outPath)
    })
  })
  .on('error', err => {
    console.error('PNG read error', err)
    process.exit(1)
  })
