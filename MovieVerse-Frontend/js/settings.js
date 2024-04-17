const DEFAULT_BACKGROUND_IMAGE = '../../images/universe-1.webp';

document.addEventListener('DOMContentLoaded', () => {
    const bgSelect = document.getElementById('background-select');
    const textColorInput = document.getElementById('text-color-input');
    const fontSizeSelect = document.getElementById('font-size-select');
    const resetButton = document.getElementById('reset-button');

    loadCustomBackgrounds();
    loadSettings();

    if (bgSelect) {
        bgSelect.addEventListener('change', function() {
            document.body.style.backgroundImage = `url('${this.value}')`;
            localStorage.setItem('backgroundImage', this.value);
        });
    }

    if (textColorInput) {
        textColorInput.addEventListener('input', function () {
            document.querySelectorAll('h1, h2, h3, p, a, span, div, button, input, select, textarea, label, li').forEach(element => {
                element.style.color = this.value;
            });
            localStorage.setItem('textColor', this.value);
        });
    }

    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function () {
            const size = this.value === 'small' ? '12px' : this.value === 'medium' ? '16px' : '20px';
            document.body.style.fontSize = size;
            localStorage.setItem('fontSize', this.value);
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function () {
            localStorage.removeItem('backgroundImage');
            localStorage.setItem('backgroundImage', '../../images/universe-1.webp')
            localStorage.removeItem('textColor');
            localStorage.removeItem('fontSize');
            window.location.reload();
        });
    }

    function loadSettings() {
        let savedBg = localStorage.getItem('backgroundImage');
        const bgSelect = document.getElementById('background-select');
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');

        if (!savedBg) {
            savedBg = '../../images/universe-1.webp';
        }

        const availableBackgrounds = [
            '../../images/universe-1.webp', '../../images/universe-2.webp', '../../images/universe-22.webp',
            '../../images/universe-3.webp', '../../images/universe-4.webp', '../../images/universe-5.webp',
            '../../images/universe-6.webp', '../../images/universe-7.webp', '../../images/universe-8.webp',
            '../../images/universe-9.webp', '../../images/universe-10.webp', '../../images/universe-11.webp',
            '../../images/universe-12.webp', '../../images/universe-13.webp', '../../images/universe-14.webp',
            '../../images/universe-15.webp', '../../images/universe-16.webp', '../../images/universe-17.webp',
            '../../images/universe-18.webp', '../../images/universe-19.webp', '../../images/universe-20.webp',
            '../../images/universe-21.webp', '../../images/universe.webp', '../../images/universe-23.webp',
            '../../images/black.webp', '../../images/grey.webp', '../../images/blue.webp',
            '../../images/silver.webp', '../../images/gold.webp', '../../images/rose.webp',
            '../../images/pink.webp', '../../images/red.webp', '../../images/green.webp',
            '../../images/brown.webp', '../../images/purple.webp', '../../images/orange.webp',
            '../../images/yellow.webp'
        ];

        if (!availableBackgrounds.includes(savedBg)) {
            savedBg = '../../images/universe-1.webp';
            localStorage.setItem('backgroundImage', savedBg);
        }

        if (savedBg) {
            let imageUrl = savedBg;
            if (savedBg === '../../images/universe-1.webp') {
                if (window.innerWidth <= 680) {
                    imageUrl = '../../images/universe-1-small.webp';
                }
                else if (window.innerWidth <= 1124) {
                    imageUrl = '../../images/universe-1-medium.webp';
                }
            }
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        }

        const foundImage = customImages.find(image => image.dataURL === savedBg);

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

        if (bgSelect) {
            bgSelect.value = foundImage ? foundImage.dataURL : savedBg;
        }
        else {
            return;
        }
    }

    const deleteButton = document.getElementById('delete-uploaded-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            deleteImagesPrompt();
            document.body.style.backgroundImage = `url('${DEFAULT_BACKGROUND_IMAGE}')`;
            localStorage.setItem('backgroundImage', DEFAULT_BACKGROUND_IMAGE);
            if (bgSelect) {
                bgSelect.value = DEFAULT_BACKGROUND_IMAGE;
            }
        });
    }
    else {
        return;
    }
})

function loadCustomBackgrounds() {
    const bgSelect = document.getElementById('background-select');
    const customImages = JSON.parse(localStorage.getItem('customImages')) || [];

    if (bgSelect) {
        customImages.forEach(image => {
            const newOption = new Option(image.name, image.dataURL);
            bgSelect.add(newOption);
        });
    }
    else {
        return;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-bg-btn');

    if (!uploadButton) {
        console.log('Upload button not found');
        return;
    }

    uploadButton.addEventListener('click', function() {
        const fileInput = document.getElementById('custom-bg-upload');
        const imageNameInput = document.getElementById('custom-bg-name');
        const bgSelect = document.getElementById('background-select');

        if (fileInput && fileInput.files.length > 0) {
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