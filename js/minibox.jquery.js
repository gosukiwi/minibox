(function ($) {
    "use strict";

    // minibox object creator
    function minibox() {
        var methods,
            // private methods
            showImage,
            browse,
            updateImageContainer,
            // private variables
            configuration,
            box,
            navigationContainer,
            imageContainer,
            currentImage;

        // private methods 
        showImage = function (e) {
            e.preventDefault();

            currentImage = e.target;
            updateImageContainer();
            methods.show();
        };

        browse = function (e) {
            var direction,
                nextImage;

            if (e === 'right') {
                direction = 'minibox-move-right';
            } else if (e === 'left') {
                direction = null;
            } else {
                e.stopPropagation();
                e.preventDefault();
                direction = $(e.target).parent().attr('id');
            }

            if (direction === 'minibox-move-right') {
                nextImage = $(currentImage).next('img');
            } else {
                nextImage = $(currentImage).prev('img');
            }

            if (nextImage.length === 0) {
                return;
            }

            currentImage = nextImage;
            updateImageContainer();
        };

        updateImageContainer = function () {
            var bodyHeight = $('body').height();
            imageContainer
                .attr('src', $(currentImage).attr('src'))
                .css('margin-top', Math.abs($(currentImage).height() - bodyHeight) / 2);
        };

        // public methods
        methods = {
            init : function (conf) {
                var btnPrev, btnNext;

                configuration = $.extend({
                    showNavigation: true,
                    showCloseButton: true,
                    prevButton: 'css/previous.png',
                    nextButton: 'css/next.png',
                    closeButton: 'css/close.png',
                    keyCodeRight: 39,
                    keyCodeLeft: 37,
                    keyCodeEscape: 27
                }, conf);

                // create html markup
                box = $('<div id="minibox-bg"></div>');
                btnPrev = $('<a href="#" id="minibox-move-left"><img src="' + configuration.prevButton + '" alt="PREV" /></a>');
                btnNext = $('<a href="#" id="minibox-move-right"><img src="' + configuration.nextButton + '" alt="PREV" /></a>');
                navigationContainer = $('<div id="minibox-options"></div>');
                imageContainer = $('<img src="" />');
                navigationContainer.append(btnPrev).append(btnNext);

                // add elements to the box
                box.append(imageContainer);

                if(configuration.showNavigation) {
                    box.append(navigationContainer)
                }

                if(configuration.showCloseButton) {
                    box.append('<img id="minibox-close" src="' + configuration.closeButton + '" alt="X" />');
                }

                // add the box to the dom
                $('body').append(box);

                // bindings & return for chainability
                btnPrev.bind('click.minibox', browse);
                btnNext.bind('click.minibox', browse);
                box.bind('click.minibox', methods.hide);

                $('body').bind('keydown.minibox', function (e) {
                    if (e.keyCode === configuration.keyCodeRight) {
                        browse('right');
                    } else if (e.keyCode === configuration.keyCodeLeft) {
                        browse('left');
                    } else if (e.keyCode === configuration.keyCodeEscape) {
                        methods.hide();
                    }
                });

                return this.each(function () {
                    // when the window is resized
                    $(window).bind('resize.minibox', methods.reposition);
                    // add a click binding to all images inside the minibox container
                    $(this).find('img[rel=minibox]').each(function (index, item) {
                        $(item).bind('click.minibox', showImage);
                    });
                });
            },

            destroy : function () {
                return this.each(function () {
                    $(window).unbind('.minibox');
                });
            },

            reposition : function () {
                updateImageContainer();
            },

            show : function () {
                box.fadeIn('fast');
            },

            hide : function () {
                box.hide();
            }
        };

        return methods;
    }

    // extend jQuery
    var methods = minibox();
    $.fn.minibox = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        $.error('Method ' +  method + ' does not exist on jQuery.minibox');
    };
}(jQuery));