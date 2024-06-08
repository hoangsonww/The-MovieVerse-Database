const DEFAULT_BACKGROUND_IMAGE = '../../images/universe-1.webp';

document.addEventListener('DOMContentLoaded', () => {
    const bgSelect = document.getElementById('background-select');
    const textColorInput = document.getElementById('text-color-input');
    const fontSizeSelect = document.getElementById('font-size-select');
    const resetButton = document.getElementById('reset-button');
    const deleteButton = document.getElementById('delete-uploaded-btn');
    const deleteImagesSection = document.getElementById('delete-images-section');
    const customImagesContainer = document.getElementById('custom-images-container');
    const deleteSelectedImagesBtn = document.getElementById('delete-selected-images-btn');

    loadCustomBackgrounds();
    loadSettings();

    if (bgSelect) {
        bgSelect.addEventListener('change', function() {
            document.body.style.backgroundImage = `url('${this.value}')`;
            localStorage.setItem('backgroundImage', this.value);
            window.location.reload();
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
            localStorage.setItem('backgroundImage', '../../images/universe-1.webp');
            localStorage.removeItem('textColor');
            localStorage.removeItem('fontSize');
            window.location.reload();
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            if (deleteImagesSection.style.display === 'block') {
                deleteImagesSection.style.display = 'none';
            } else {
                deleteImagesSection.style.display = 'block';
                updateCustomImagesDisplay();
            }
        });
    }

    if (deleteSelectedImagesBtn) {
        deleteSelectedImagesBtn.addEventListener('click', () => {
            const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
            const selectedIndexes = Array.from(document.querySelectorAll('.delete-checkbox:checked')).map(checkbox => parseInt(checkbox.value));

            const updatedImages = customImages.filter((_, index) => !selectedIndexes.includes(index));
            localStorage.setItem('customImages', JSON.stringify(updatedImages));

            updateCustomImagesDisplay();
            updateBackgroundSelectOptions();
            alert('Selected images have been deleted.');
            window.location.reload();
        });
    }

    function updateCustomImagesDisplay() {
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
        customImagesContainer.innerHTML = '';

        if (customImages.length === 0) {
            customImagesContainer.innerHTML = '<p>No custom images uploaded.</p>';
            deleteSelectedImagesBtn.style.display = 'none';
            return;
        }

        customImages.forEach((image, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('delete-checkbox');
            checkbox.value = index;

            const img = document.createElement('img');
            img.src = image.dataURL;
            img.alt = image.name;
            img.style.width = '100px';

            const imageName = document.createElement('span');
            imageName.classList.add('image-name');
            imageName.textContent = image.name;

            // Toggle checkbox when image container is clicked
            imageContainer.addEventListener('click', (e) => {
                if (e.target !== checkbox) { // Prevent checkbox click event from toggling twice
                    checkbox.checked = !checkbox.checked;
                }
            });

            imageContainer.appendChild(checkbox);
            imageContainer.appendChild(img);
            imageContainer.appendChild(imageName);
            customImagesContainer.appendChild(imageContainer);
        });

        deleteSelectedImagesBtn.style.display = 'block';
    }

    function loadSettings() {
        let savedBg = localStorage.getItem('backgroundImage');
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');

        if (!savedBg) {
            savedBg = DEFAULT_BACKGROUND_IMAGE;
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

        if (!availableBackgrounds.includes(savedBg) && !customImages.find(image => image.dataURL === savedBg)) {
            savedBg = DEFAULT_BACKGROUND_IMAGE;
            localStorage.setItem('backgroundImage', savedBg);
        }

        if (savedBg) {
            let imageUrl = savedBg;
            if (savedBg === DEFAULT_BACKGROUND_IMAGE) {
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
    }

    function loadCustomBackgrounds() {
        const bgSelect = document.getElementById('background-select');
        const customImages = JSON.parse(localStorage.getItem('customImages')) || [];

        if (bgSelect) {
            customImages.forEach(image => {
                const newOption = new Option(image.name, image.dataURL);
                bgSelect.add(newOption);
            });
        }
    }
});

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
            const quota = 4.5 * 1024 * 1024; // 4.5 MB

            if (totalSize >= quota) {
                handleQuotaExceedance();
                window.location.reload();
                return;
            }

            if (file.size > 204800) { // 200 KB
                resizeImage(file, 204800, (resizedDataUrl, err) => {
                    if (err) {
                        alert(`Error resizing the image due to a limitation in your browser. Browser error: ${err.message} Your image might still appear as the background, but it will not be stable. We recommend deleting it and then using a different browser or uploading an image smaller than 1MB.`);
                        return;
                    }
                    processImageUpload(resizedDataUrl, imageNameInput, bgSelect);
                    alert('The uploaded image was resized to fit the size limit of 200KB.');
                    window.location.reload();
                });
            }
            else {
                const reader = new FileReader();
                reader.onload = function (e) {
                    processImageUpload(e.target.result, imageNameInput, bgSelect);
                    window.location.reload();
                };
                reader.onerror = function () {
                    alert('Error reading the file.');
                    window.location.reload();
                };
                reader.readAsDataURL(file);
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
    if (!(window.FileReader && window.Blob && window.HTMLCanvasElement)) {
        callback(null, new Error('Your browser does not support resizing images. Please use a different browser or upload an image smaller than 200KB.'));
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            try {
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

                callback(canvas.toDataURL('image/jpeg'), null);

                canvas.height = 0;
                canvas.width = 0;
                canvas = null;
            }
            catch (error) {
                callback(null, error);
            }
        };
        img.onerror = function() {
            callback(null, new Error('Failed to load the image.'));
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        callback(null, new Error('Failed to read the image file.'));
    };

    reader.readAsDataURL(file);
}
