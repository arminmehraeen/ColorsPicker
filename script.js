var colorNames = {
    "#000000": "Black",
    "#ffffff": "White",
    // Add more color mappings as needed
};

function generateGradient() {
    var color1 = "#" + Math.random().toString(16).substr(2,6);
    var color2 = "#" + Math.random().toString(16).substr(2,6);
    
    $('.color').each(function(index){
        var gradientColor = interpolateColor(color1, color2, index / 3); // 3 is the number of color blocks
        
        $(this).css('background-color',gradientColor);
        $(this).children(".color-hex").text(gradientColor);
        $(this).children(".color-name").text(colorNames[gradientColor.toUpperCase()] || "Unknown");
    });
}

function interpolateColor(color1, color2, factor) {
    if (color1.length !== 7 || color2.length !== 7) return null; // Invalid color format
    var result = "#";
    for (var i = 1; i <= 6; i += 2) {
        var c1 = parseInt(color1.substr(i, 2), 16);
        var c2 = parseInt(color2.substr(i, 2), 16);
        var interpolated = Math.round(c1 + factor * (c2 - c1));
        result += ("0" + interpolated.toString(16)).slice(-2);
    }
    return result;
}

$('.refresh').click(function(){
    $('.color').each(function(){
        var rColor = "#" + Math.random().toString(16).substr(2,6);
        $(this).css('background-color',rColor);
        $(this).children(".color-hex").text(rColor);
        $(this).children(".color-name").text(colorNames[rColor.toUpperCase()] || "Unknown");
    });
}).trigger('click');

$('.generate-gradient').click(function(){
    generateGradient();
});

$('.color').click(function(){
    var input = $('<input>');
    var color = $(this).children(".color-hex").text();
    $('body').append(input);
    input.val(color).select();
    document.execCommand('copy');
    input.remove();
    $('.copied').fadeIn().delay(2000).fadeOut(); 
});
