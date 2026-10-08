// Shrink listing photos in the browser before upload: long edge <= 2000px, JPEG, under the bucket's 5 MB limit.
import { MAX_PHOTO_BYTES } from './listing'

const MAX_EDGE = 2000
const MAX_INPUT_BYTES = 30 * 1024 * 1024

export async function preparePhoto(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} isn't an image. Use JPG, PNG or WebP.`)
  if (file.size > MAX_INPUT_BYTES) throw new Error(`${file.name} is too large (max 30 MB before resizing).`)
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error(`Couldn't read ${file.name}. Use a JPG, PNG or WebP photo.`)
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser could not process this photo.')
  ctx.fillStyle = '#ffffff' // flatten transparent PNGs
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  for (const q of [0.85, 0.72, 0.6]) {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', q))
    if (blob && blob.size <= MAX_PHOTO_BYTES) return blob
  }
  throw new Error(`${file.name} is still over 5 MB after resizing.`)
}
