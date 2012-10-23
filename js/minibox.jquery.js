(function ($) {
    "use strict";

    // minibox object creator
    function minibox() {
        var methods,
            // private methods
            showImage,
            browse,
            updateImageContainer,
            getInnerHeight,
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
            box.css({
                'marginTop': $('body').scrollTop()
            });

            imageContainer
                .attr('src', $(currentImage).attr('src'))
                .css('margin-top', Math.abs($(currentImage).height() - getInnerHeight()) / 2);
        };

        getInnerHeight = function () {
            var height = 0;

            if(typeof(window.innerWidth) === 'number') {
                height = window.innerHeight;
            } else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                height = document.documentElement.clientHeight;
            } else if(document.body && (document.body.clientWidth || document.body.clientHeight)) {
                height = document.body.clientHeight;
            }

            return height;
        };

        // public methods
        methods = {
            init : function (conf) {
                var btnPrev, btnNext;

                configuration = $.extend({
                    showNavigation: true, // whether or not to show the navigation options at the bottom of the image
                    showCloseButton: true, // whether or not to show the close button at the top-right of the page
                    prevButton: 'css/previous.png', // the prev button image, if you want to change it
                    nextButton: 'css/next.png', // the next button image, if you want to change it
                    closeButton: 'css/close.png', // the close button image, if you want to change it
                    keyCodeRight: 39, // the keyCode which will be equivalent to the next button
                    keyCodeLeft: 37, // the keyCode which will be equivalent to the prev button
                    keyCodeEscape: 27 // the keyCode which will be equivalent to the close button
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
                    box.append(navigationContainer);
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

                $(window).bind('scroll.minibox', methods.reposition);

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