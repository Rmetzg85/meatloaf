const fs = require('fs')

// avoid relying on path.join in this script (some environments may shadow `path`)
const publicDir = __dirname + '/../public'
const logoPath = publicDir + '/logo.png'
const backupPath = publicDir + '/logo.orig.png'
const outPath = publicDir + '/logo.png';

;(async function run() {
  let Jimp
  try {
    Jimp = require('jimp')
  } catch (e) {
    try {
      Jimp = require('jimp/dist/commonjs')
    } catch (e2) {
      const JimpModule = await import('jimp').catch(err => {
        console.error('Failed to import jimp:', err)
        process.exit(1)
      })
      Jimp = JimpModule.default || JimpModule
    }
  }

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

  const image = await Jimp.read(logoPath)

  // Sample the top-left corner (and a few nearby pixels) to estimate background color
  const samples = []
  const sampleCoords = [
    [0, 0], [1, 0], [0, 1], [2, 0], [0, 2]
  ]

  for (const [x, y] of sampleCoords) {
    if (x < image.bitmap.width && y < image.bitmap.height) {
      samples.push(Jimp.intToRGBA(image.getPixelColor(x, y)))
    }
  }

  const avg = samples.reduce((acc, c) => ({
    r: acc.r + c.r,
    g: acc.g + c.g,
    b: acc.b + c.b
  }), { r: 0, g: 0, b: 0 })

  const bg = {
    r: Math.round(avg.r / samples.length),
    g: Math.round(avg.g / samples.length),
    b: Math.round(avg.b / samples.length)
  }

  console.log('Detected background color:', bg)

  function colorDist(a, b) {
    return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
  }

  const threshold = 30 // tweak if needed

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]

    const d = colorDist({ r, g, b }, bg)
    if (d < threshold) {
      // make pixel transparent
      this.bitmap.data[idx + 3] = 0
    }
  })

  await image.writeAsync(outPath)
  console.log('Wrote transparent logo to', outPath)
})().catch(err => {
  console.error(err)
  process.exit(1)
})
