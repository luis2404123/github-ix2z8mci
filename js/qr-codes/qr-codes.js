// Update the renderQRCodes method
renderQRCodes(qrCodes) {
  const container = document.getElementById('qr-codes-grid');
  if (!container) return;

  container.innerHTML = qrCodes.length ? '' : '<p>No QR codes found</p>';

  qrCodes.forEach(qrCode => {
    const element = document.createElement('div');
    element.className = 'qr-code-card';
    element.innerHTML = `
      <img src="${qrCode.code_url}" alt="QR Code" class="qr-code-image">
      <div class="qr-code-info">
        <h3>${qrCode.translation_name}</h3>
        <p class="qr-code-meta">Created: ${new Date(qrCode.created_at).toLocaleString()}</p>
        <div class="qr-code-actions">
          <button class="action-btn download-btn" data-url="${qrCode.code_url}" data-name="${qrCode.translation_name}">
            <span class="material-symbols-outlined">download</span>
            Download
          </button>
          <button class="action-btn share-btn" data-url="${qrCode.code_url}" data-name="${qrCode.translation_name}">
            <span class="material-symbols-outlined">share</span>
            Share
          </button>
          ${qrCode.active ? `
            <button class="action-btn deactivate-btn" data-id="${qrCode.id}">
              <span class="material-symbols-outlined">block</span>
              Deactivate
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Add event listeners
    const downloadBtn = element.querySelector('.download-btn');
    const shareBtn = element.querySelector('.share-btn');
    const deactivateBtn = element.querySelector('.deactivate-btn');

    downloadBtn.addEventListener('click', () => this.showDownloadModal(qrCode));
    shareBtn.addEventListener('click', () => this.showShareModal(qrCode));
    if (deactivateBtn) {
      deactivateBtn.addEventListener('click', () => this.deactivateQRCode(qrCode.id));
    }

    container.appendChild(element);
  });
}

showDownloadModal(qrCode) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Download QR Code</h2>
        <button class="close-btn">&times;</button>
      </div>
      <div class="format-options">
        <div class="format-option">
          <input type="radio" id="png" name="format" value="png" checked>
          <label for="png">
            <span class="format-name">PNG</span>
            <span class="format-info">High quality, best for printing (~50KB)</span>
          </label>
        </div>
        <div class="format-option">
          <input type="radio" id="webp" name="format" value="webp">
          <label for="webp">
            <span class="format-name">WebP</span>
            <span class="format-info">Optimized for web (~30KB)</span>
          </label>
        </div>
        <div class="format-option">
          <input type="radio" id="jpeg" name="format" value="jpeg">
          <label for="jpeg">
            <span class="format-name">JPEG</span>
            <span class="format-info">Compressed, smaller file size (~20KB)</span>
          </label>
        </div>
      </div>
      <button class="primary-btn download-btn">
        <span class="material-symbols-outlined">download</span>
        Download QR Code
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';

  // Handle close button
  const closeBtn = modal.querySelector('.close-btn');
  closeBtn.onclick = () => {
    modal.remove();
  };

  // Handle click outside modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  // Handle download button
  const downloadBtn = modal.querySelector('.download-btn');
  downloadBtn.onclick = async () => {
    const format = modal.querySelector('input[name="format"]:checked').value;
    modal.remove();
    await QRCodeActions.downloadQRCode(qrCode.code_url, format);
  };
}

showShareModal(qrCode) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Share QR Code</h2>
        <button class="close-btn">&times;</button>
      </div>
      <div class="share-preview">
        <img src="${qrCode.code_url}" alt="QR Code Preview" class="qr-preview">
        <p class="share-title">${qrCode.translation_name}</p>
      </div>
      <div class="share-options">
        <button class="share-option" data-method="copy">
          <span class="material-symbols-outlined">content_copy</span>
          Copy Link
        </button>
        <button class="share-option" data-method="email">
          <span class="material-symbols-outlined">email</span>
          Email
        </button>
        <button class="share-option" data-method="twitter">
          <span class="material-symbols-outlined">share</span>
          Twitter
        </button>
        <button class="share-option" data-method="linkedin">
          <span class="material-symbols-outlined">share</span>
          LinkedIn
        </button>
      </div>
      <div class="share-message">
        <textarea placeholder="Add a message (optional)"></textarea>
      </div>
      <button class="primary-btn share-btn">
        <span class="material-symbols-outlined">share</span>
        Share QR Code
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';

  // Handle close button
  const closeBtn = modal.querySelector('.close-btn');
  closeBtn.onclick = () => {
    modal.remove();
  };

  // Handle click outside modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  // Handle share options
  const shareOptions = modal.querySelectorAll('.share-option');
  shareOptions.forEach(option => {
    option.onclick = async () => {
      const method = option.dataset.method;
      const message = modal.querySelector('textarea').value;
      modal.remove();
      await this.handleShare(qrCode, method, message);
    };
  });

  // Handle main share button
  const shareBtn = modal.querySelector('.share-btn');
  shareBtn.onclick = async () => {
    const message = modal.querySelector('textarea').value;
    modal.remove();
    await QRCodeActions.shareQRCode(qrCode.code_url, message);
  };
}

async handleShare(qrCode, method, message) {
  const shareText = message || `Check out this QR code for ${qrCode.translation_name}`;
  const shareUrl = qrCode.code_url;

  try {
    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        this.showMessage('Link copied to clipboard!', 'success');
        break;
      case 'email':
        window.location.href = `mailto:?subject=QR Code: ${qrCode.translation_name}&body=${shareText}%0A%0A${shareUrl}`;
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
    }
  } catch (error) {
    console.error('Share error:', error);
    this.showMessage('Failed to share QR code', 'error');
  }
}

showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}