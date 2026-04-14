const CLOUD_NAME = 'dujmo9fbu'
const UPLOAD_PRESET = 'ag_dealer_connect' // create this unsigned preset in Cloudinary dashboard

export async function uploadImage(file, folder = 'submissions') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id
  }
}

export async function uploadAvatar(file) {
  return uploadImage(file, 'avatars')
}

export function getOptimizedUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url || !url.includes('cloudinary')) return url
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`)
}

export function getThumbnailUrl(url) {
  return getOptimizedUrl(url, { width: 400, quality: 'auto' })
}
