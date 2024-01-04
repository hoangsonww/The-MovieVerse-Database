document.addEventListener('DOMContentLoaded', () => {
    const bgSelect = document.getElementById('background-select');
    const textColorInput = document.getElementById('text-color-input');
    const fontSizeSelect = document.getElementById('font-size-select');
    const resetButton = document.getElementById('reset-button');

    loadSettings();

    bgSelect.addEventListener('change', function() {
        document.body.style.backgroundImage = `url('${this.value}')`;
        localStorage.setItem('backgroundImage', this.value);
    });

    textColorInput.addEventListener('input', function() {
        document.querySelectorAll('h1, h2, h3, p, span, div, button, input, select, textarea, label').forEach(element => {
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
        localStorage.removeItem('textColor');
        localStorage.removeItem('fontSize');
        window.location.reload();
    });

    function loadSettings() {
        let savedBg = localStorage.getItem('backgroundImage');
        const savedTextColor = localStorage.getItem('textColor');
        const savedFontSize = localStorage.getItem('fontSize');

        if (!savedBg) {
            savedBg = '../../images/universe-1.png';
        }
        document.body.style.backgroundImage = `url('${savedBg}')`;
        bgSelect.value = savedBg;

        if (savedTextColor) {
            document.querySelectorAll('h1, h2, h3, p, span, div, button, input, select, textarea, label').forEach(element => {
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
});

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeString = hours + ':' + minutes;
    document.getElementById('clock').innerHTML = timeString;
}
setInterval(updateClock, 1000);
window.onload = updateClock;