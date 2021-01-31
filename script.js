        $('.refresh').click(function(){
            $('.color').each(function(){
                var rColor = "#" + Math.random().toString(16).substr(2,6);
                $(this).css('background-color',rColor);
                $(this).children(".color-hex").text(rColor);

            });
        }).trigger('click');

        $('.color').click(function(){
            var input = $('<input>');
            var color = $(this).children(".color-hex").text();
            $('body').append(input);
            input.val(color).select();
            document.execCommand('copy');
            input.remove();
            $('.copied').fadeIn().delay(2000).fadeOut(); 
        });