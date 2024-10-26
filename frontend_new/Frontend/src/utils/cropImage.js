// src/utils/cropImage.js
export default function getCroppedImg(imageSrc, crop) {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.setAttribute('crossOrigin', 'anonymous'); // Prevent cross-origin issues
        image.src = url;
      });
  
    const createCanvas = (width, height) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    };
  
    return new Promise(async (resolve, reject) => {
      const image = await createImage(imageSrc);
      const canvas = createCanvas(crop.width, crop.height);
      const ctx = canvas.getContext('2d');
  
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
  
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl); // Return the cropped image as a Blob URL
      }, 'image/jpeg');
    });
  }
  