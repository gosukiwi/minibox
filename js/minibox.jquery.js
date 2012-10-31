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
            resizeImage,
            autoBrowse,
            // private variables
            configuration,
            firstImage,
            lastImage,
            box,
            navigationContainer,
            imageContainer,
            currentImage,
            timeout; // for the setTimeout

        // private methods 
        showImage = function (e) {
            e.preventDefault();

            currentImage = e.target;
            updateImageContainer();
            methods.show();
        };

        autoBrowse = function() {
            if(configuration.autoPlay > 0) {
                timeout = setTimeout(autoBrowse, configuration.autoPlay * 1000);
            }

            if($(currentImage).attr('src') === $(lastImage).attr('src')) {
                currentImage = firstImage;
                updateImageContainer();
                return;
            }

            browse('right', true);
        };

        browse = function (e, auto) {
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

            if(!auto) {
                window.clearTimeout(timeout);

                if(configuration.stopAutoPlayOnButton === false) {
                    timeout = setTimeout(autoBrowse, 
                        configuration.autoPlay * 1000);
                }
            }
        };

        updateImageContainer = function () {
            var realHeight = $(currentImage).attr('real-height');

            box.css({
                'marginTop': $('body').scrollTop()
            });

            imageContainer
                .hide()
                .attr({
                    src: $(currentImage).attr('src'),
                    height: realHeight
                })
                .css('margin-top', Math.abs(realHeight - getInnerHeight()) / 2)
                .fadeIn('fast');
        };

        getInnerHeight = function () {
            var height = 0;

            if (typeof (window.innerWidth) === 'number') {
                height = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                height = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                height = document.body.clientHeight;
            }

            return height;
        };

        resizeImage = function (item) {
            var w = configuration.thumbails.width,
                h = configuration.thumbails.height,
                realHeight = item.height();

            if (w === 0 && h === 0) {
                if(realHeight > configuration.maxHeight) {
                    realHeight = configuration.maxHeight;
                }

                item.attr('real-height', realHeight);
                return;
            }

            if (!w) {
                w = (h * item.width()) / item.height();
            } else {
                h = (w * item.height()) / item.width();
            }

            item
                .attr('real-height', item.height())
                .css({
                    width: w,
                    height: h
                });
        };

        // public methods
        methods = {
            init : function (conf) {
                var btnPrev, btnNext;

                configuration = $.extend({
                    // options
                    showNavigation: true, // whether or not to show the navigation options at the bottom of the image
                    showCloseButton: true, // whether or not to show the close button at the top-right of the page
                    prevButton: 'css/previous.png', // the prev button image, if you want to change it
                    nextButton: 'css/next.png', // the next button image, if you want to change it
                    closeButton: 'css/close.png', // the close button image, if you want to change it
                    keyCodeRight: 39, // the keyCode which will be equivalent to the next button
                    keyCodeLeft: 37, // the keyCode which will be equivalent to the prev button
                    keyCodeEscape: 27, // the keyCode which will be equivalent to the close button
                    thumbails: { width: 0, height: 0 }, // if you want to resize the images to make thumbails
                    autoOpen: false, // if true, it will open on page load
                    autoPlay: 0, // if x > 0, it will autoplay the gallery every x seconds
                    stopAutoPlayOnButton: false, // when the user clicks the prev or next button, stop autoplay if its enabled
                    maxHeight: 650, // the maximum height of the images shown

                    // events
                    onImagesLoaded: function () {}, // when the images finished loading
                    onOpen: function () {}, // when the lightbox opens
                    onBeforeClose: function () {} // before the lightbox closes
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

                if (configuration.showNavigation) {
                    box.append(navigationContainer);
                }

                if (configuration.showCloseButton) {
                    box.append('<img id="minibox-close" src="' + configuration.closeButton + '" alt="X" />');
                }

                // add the box to the dom
                $('body').append(box);

                // bindings & return for chainability
                btnPrev.bind('click.minibox', browse);
                btnNext.bind('click.minibox', browse);
                box.bind('click.minibox', methods.hide);

                $('body').bind('keyup.minibox', function (e) {
                    if (e.keyCode === configuration.keyCodeRight) {
                        browse('right');
                    } else if (e.keyCode === configuration.keyCodeLeft) {
                        browse('left');
                    } else if (e.keyCode === configuration.keyCodeEscape) {
                        methods.hide();
                    }
                });

                $(window).bind('scroll.minibox', methods.reposition);
                $(window).bind('resize.minibox', methods.reposition);

                this.each(function () {
                    var first, 
                        imagesList = $(this).find('img[rel=minibox]'),
                        totalImages = imagesList.length,
                        imagesLoaded = 0;

                    imagesList.each(function (index, item) {
                        item = $(item);
                        first = first || item;
                        firstImage = firstImage || item;
                        lastImage = item;

                        item
                            .hide()
                            .one('load', function () {
                                imagesLoaded += 1;
                                resizeImage(item);
                                $(this).fadeIn('slow');

                                if (configuration.autoOpen && first === item) {
                                    currentImage = item;
                                    updateImageContainer();
                                    methods.show();
                                }

                                if(imagesLoaded === totalImages) {
                                    configuration.onImagesLoaded();
                                }
                            })
                            .each(function () {
                                if (this.complete) {
                                    $(this).load();
                                }
                            })
                            .bind('click.minibox', showImage);
                    });
                });

                return this;
            },

            destroy : function () {
                box.remove();
            },

            reposition : function () {
                updateImageContainer();
            },

            show : function () {
                box.fadeIn('fast');

                if(configuration.autoPlay > 0) {
                    timeout = setTimeout(autoBrowse, configuration.autoPlay * 1000);
                }

                configuration.onOpen();
            },

            hide : function () {
                configuration.onBeforeClose();
                box.hide();
            }
        };

        return methods;
    }

    // extend jQuery
    var instances = {};
    $.fn.minibox = function (method) {
        var methods,
            id;

        id = $(this).attr('id');

        if (!id) {
            $.error('This plugin requires the container to have an id attribute');
        }

        // create new instance if not exists
        if (!instances[id]) {
            instances[id] = minibox();
        }

        methods = instances[id];

        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }

        $.error('Method ' +  method + ' does not exist on jQuery.minibox');
    };
}(jQuery));