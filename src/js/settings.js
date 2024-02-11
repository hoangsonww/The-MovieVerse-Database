document.addEventListener('DOMContentLoaded', () => {
    const bgSelect = document.getElementById('background-select');
    const textColorInput = document.getElementById('text-color-input');
    const fontSizeSelect = document.getElementById('font-size-select');
    const resetButton = document.getElementById('reset-button');

    loadCustomBackgrounds();
    loadSettings();

    bgSelect.addEventListener('change', function() {
        document.body.style.backgroundImage = `url('${this.value}')`;
        localStorage.setItem('backgroundImage', this.value);
    });

    textColorInput.addEventListener('input', function() {
        document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
            element.style.color = this.value;
        });
        localStorage.setItem('textColor', this.value);
    });

    fontSizeSelect.addEventListener('change', function() {
        const size = this.value === 'small' ? '12px' : this.value === 'medium' ? '16px' : '20px';
        document.body.style.fontSize = size;
        localStorage.setItem('fontSize', this.value);
    });

    resetButton.addEventListener('click', function() {
        localStorage.removeItem('backgroundImage');
        localStorage.setItem('backgroundImage', '../../images/universe-1.png')
        localStorage.removeItem('textColor');
        localStorage.removeItem('fontSize');
        window.location.reload();
    });

    function loadSettings() {
        let savedBg = localStorage.getItem('backgroundImage');
        const bgSelect = document.getElementById('background-select');
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');

        if (!savedBg) {
            savedBg = '../../images/universe-1.png';
        }
        document.body.style.backgroundImage = `url('${savedBg}')`;
        const foundImage = customImages.find(image => image.dataURL === savedBg);
        bgSelect.value = foundImage ? foundImage.dataURL : savedBg;

        if (savedTextColor) {
            document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
                element.style.color = savedTextColor;
            });
            textColorInput.value = savedTextColor;
        }
        if (savedFontSize) {
            const size = savedFontSize === 'small' ? '12px' : savedFontSize === 'medium' ? '16px' : '20px';
            document.body.style.fontSize = size;
            fontSizeSelect.value = savedFontSize;
        }
    }

    document.getElementById('delete-uploaded-btn').addEventListener('click', function() {
        deleteImagesPrompt();
    });
});

function loadCustomBackgrounds() {
    const bgSelect = document.getElementById('background-select');
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];

    customImages.forEach(image => {
        const newOption = new Option(image.name, image.dataURL);
        bgSelect.add(newOption);
    });
}

document.getElementById('upload-bg-btn').addEventListener('click', function() {
    const fileInput = document.getElementById('custom-bg-upload');
    const imageNameInput = document.getElementById('custom-bg-name');
    const bgSelect = document.getElementById('background-select');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
        const totalSize = customImages.reduce((sum, img) => sum + img.dataURL.length, 0);
        const quota = 4.5 * 1024 * 1024;

        if (totalSize >= quota) {
            handleQuotaExceedance();
        }
        else {
            if (file.size > 204800) { // 200KB
                resizeImage(file, 204800, (resizedDataUrl) => {
                    processImageUpload(resizedDataUrl, imageNameInput, bgSelect);
                    alert('The uploaded image was resized to fit the size limit of 200KB.');
                });
            }
            else {
                const reader = new FileReader();
                reader.onload = function (e) {
                    processImageUpload(e.target.result, imageNameInput, bgSelect);
                };
                reader.readAsDataURL(file);
            }
        }
    }
    else {
        alert('Please select an image to upload.');
    }
});

function handleQuotaExceedance() {
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
    if (customImages.length > 0) {
        alert('Your custom image storage has exceeded the quota. Please delete at least two images to continue.');

        deleteImagesPrompt();
    }
}

function deleteImagesPrompt() {
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
    if (customImages.length === 0) {
        alert('No custom images to delete.');
        return;
    }

    let message = 'Select images to delete:\n';
    customImages.forEach((image, index) => {
        message += `${index + 1}. ${image.name}\n`;
    });
    message += 'Enter the numbers of the images to delete (e.g., 1,3):';

    const input = prompt(message);
    if (input) {
        const indexesToDelete = input.split(',').map(num => parseInt(num.trim()) - 1);
        const updatedImages = customImages.filter((_, index) => !indexesToDelete.includes(index));
        localStorage.setItem('customImages', JSON.stringify(updatedImages));
        updateBackgroundSelectOptions();
        alert('Selected images have been deleted.');
    }
}

function updateBackgroundSelectOptions() {
    const bgSelect = document.getElementById('background-select');
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];

    Array.from(bgSelect.options).forEach(option => {
        if (option.value.startsWith('data:image')) {
            bgSelect.remove(option.index);
        }
    });

    customImages.forEach(image => {
        const newOption = new Option(image.name, image.dataURL);
        bgSelect.add(newOption);
    });
}

function processImageUpload(dataUrl, imageNameInput, bgSelect) {
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
    let imageName = imageNameInput.value.trim();

    if (!imageName) {
        imageName = `User-Added Image ${customImages.length + 1}`;
    }

    customImages.push({ name: imageName, dataURL: dataUrl });
    localStorage.setItem('customImages', JSON.stringify(customImages));

    const newOption = new Option(imageName, dataUrl);
    bgSelect.add(newOption);
    bgSelect.value = dataUrl;

    document.body.style.backgroundImage = `url('${dataUrl}')`;
    localStorage.setItem('backgroundImage', dataUrl);
}

function resizeImage(file, maxSize, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            }
            else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            callback(canvas.toDataURL('image/jpeg'));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

