const colorNames = {
    "#000000": "Black",
    "#FFFFFF": "White",
    "#FF0000": "Red",
    "#00FF00": "Green",
    "#0000FF": "Blue",
    "#FFFF00": "Yellow",
    "#FF00FF": "Magenta",
    "#00FFFF": "Cyan",
    "#800000": "Maroon",
    "#008000": "Dark Green",
    "#000080": "Navy",
    "#808000": "Olive",
    "#800080": "Purple",
    "#008080": "Teal",
    "#C0C0C0": "Silver",
    "#808080": "Gray",
    "#FFA500": "Orange",
    "#A52A2A": "Brown",
    "#FFC0CB": "Pink",
    "#FFD700": "Gold"
};

class ColorPalette {
    constructor() {
        this.savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        this.setupTheme();
        this.init();
    }

    setupTheme() {
        const themeSwitch = document.getElementById('theme-switch');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        if (localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
            document.body.setAttribute('data-theme', 'dark');
            themeSwitch.checked = true;
        }

        // Handle theme switch
        themeSwitch.addEventListener('change', () => {
            if (themeSwitch.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    init() {
        this.setupEventListeners();
        this.generateRandomColors();
    }

    setupEventListeners() {
        // Random button
        $('.refresh').click(() => this.generateRandomColors());

        // Gradient button
        $('.generate-gradient').click(() => this.generateGradient());

        // Custom color button
        $('.color-picker-btn').click(() => {
            $('.color-picker-dialog').addClass('show');
        });

        // Dialog close buttons
        $('.close-dialog, .dialog-btn.cancel').click(() => {
            $('.color-picker-dialog').removeClass('show');
        });

        // Color picker input
        $('#color-picker').on('input', () => {
            const color = $('#color-picker').val();
            $('.preview-color').css('background-color', color);
            $('.preview-hex').text(color.toUpperCase());
            const rgb = this.hexToRgb(color);
            $('.preview-rgb').text(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        });

        // Apply color button
        $('.dialog-btn.apply').click(() => {
            const color = $('#color-picker').val();
            this.addCustomColor(color);
            $('.color-picker-dialog').removeClass('show');
        });

        // Close dialog when clicking outside
        $('.color-picker-dialog').click((e) => {
            if (e.target === $('.color-picker-dialog')[0]) {
                $('.color-picker-dialog').removeClass('show');
            }
        });

        // Copy color functionality
        $('.color').click((e) => {
            if (!$(e.target).hasClass('copy-btn')) {
                this.copyColor($(e.currentTarget));
            }
        });
        $('.copy-btn').click((e) => {
            e.stopPropagation();
            this.copyColor($(e.currentTarget).parent());
        });
    }

    generateRandomColors() {
        $('.color').each((index, element) => {
            const color = this.getRandomColor();
            this.updateColorElement($(element), color);
        });
    }

    generateGradient() {
        const color1 = this.getRandomColor();
        const color2 = this.getRandomColor();
        
        $('.color').each((index, element) => {
            const gradientColor = this.interpolateColor(color1, color2, index / ($('.color').length - 1));
            this.updateColorElement($(element), gradientColor);
        });
    }

    addCustomColor(color) {
        const $colors = $('.color');
        const randomIndex = Math.floor(Math.random() * $colors.length);
        this.updateColorElement($($colors[randomIndex]), color);
    }

    updateColorElement($element, color) {
        $element.css('background-color', color);
        $element.find('.color-hex').text(color.toUpperCase());
        $element.find('.color-name').text(colorNames[color.toUpperCase()] || "Unknown");
        const rgb = this.hexToRgb(color);
        $element.find('.color-rgb').text(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    }

    getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    interpolateColor(color1, color2, factor) {
        if (color1.length !== 7 || color2.length !== 7) return null;
        
        let result = "#";
        for (let i = 1; i <= 6; i += 2) {
            const c1 = parseInt(color1.substr(i, 2), 16);
            const c2 = parseInt(color2.substr(i, 2), 16);
            const interpolated = Math.round(c1 + factor * (c2 - c1));
            result += ("0" + interpolated.toString(16)).slice(-2);
        }
        return result;
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    copyColor($colorElement) {
        const color = $colorElement.find('.color-hex').text();
        const $temp = $('<input>');
        $('body').append($temp);
        $temp.val(color).select();
        document.execCommand('copy');
        $temp.remove();
        
        this.showNotification();
    }

    showNotification() {
        $('.notification').fadeIn().delay(2000).fadeOut();
    }
}

// Initialize the color palette
$(document).ready(() => {
    new ColorPalette();
});
