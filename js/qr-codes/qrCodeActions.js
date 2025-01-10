import { showMessage } from '../utils/messageHandler.js';

export class QRCodeActions {
  static showLoadingModal(message) {
    const modal = document.createElement('div');
    modal.className = 'loading-modal';
    modal.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  static async downloadQRCode(url, format = 'png') {
    try {
      // Show loading indicator
      const loadingModal = this.showLoadingModal('Preparing download...');
      
      // Create a new image to load the QR code
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      
      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load QR code image'));
      });

      // Load image
      img.src = url;
      const loadedImg = await imageLoadPromise;

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = loadedImg.width;
      canvas.height = loadedImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(loadedImg, 0, 0);

      // Convert to desired format
      const mimeTypes = {
        png: 'image/png',
        webp: 'image/webp',
        jpeg: 'image/jpeg'
      };

      const mimeType = mimeTypes[format] || mimeTypes.png;
      const quality = format === 'png' ? 1 : 0.85;

      // Get blob from canvas
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, mimeType, quality);
      });

      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `qr-code.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      URL.revokeObjectURL(downloadUrl);
      loadingModal.remove();
      showMessage('QR code downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download error:', error);
      showMessage('Failed to download QR code. Please try again.', 'error');
    }
  }

  static async shareQRCode(url, message = '') {
    try {
      // First try clipboard as it's most widely supported
      await navigator.clipboard.writeText(url);
      
      // Then try Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'QR Code',
            text: message || 'Check out this QR code',
            url: url
          });
          showMessage('QR code shared successfully!', 'success');
        } catch (shareError) {
          // If share is cancelled or fails, fallback to clipboard message
          if (shareError.name !== 'AbortError') {
            showMessage('QR code URL copied to clipboard!', 'success');
          }
        }
      } else {
        // If Web Share API is not available, show clipboard success
        showMessage('QR code URL copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Share error:', error);
      showMessage('Failed to share QR code. Please try again.', 'error');
    }
  }
}