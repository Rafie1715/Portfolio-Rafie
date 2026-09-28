// Direct unsigned upload, restored at the owner's request.
// This preset is public; the admin page guard does not restrict Cloudinary's endpoint.
const CLOUD_NAME = 'djchoocal';
const UPLOAD_PRESET = 'rafie_portfolio';

export async function uploadImage({ file, onProgress = () => {} }) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPG, PNG, or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB.');
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.timeout = 60000;
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status !== 200 || !result.secure_url?.startsWith('https://res.cloudinary.com/')) throw new Error('Image upload failed. Check the unsigned upload preset.');
        resolve(result.secure_url);
      } catch { reject(new Error('Image upload failed. Check the unsigned upload preset.')); }
    };
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Please retry.'));
    xhr.send(form);
  });
}
