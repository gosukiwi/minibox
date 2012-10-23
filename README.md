# minibox

minibox is a minimal lightbox, based on jQuery (it's a jQuery plugin).

The usage is pretty straight forward, the idea is to enable the lightbox for
all images with the ```rel="minibox"``` attribute.

## Javascript

```
$('.myContainer').minibox();
```

Enable with all images inside that div, if you want to enable for all images on
your site, you can do

```
$('body').minibox();
```

### Options

To define custom options to the lightbox just pass an object to the constructor

```
$('.myContainer').minibox({
    showNavigation: false,
    nextButton: 'myImages/mybutton.png'
});
```

## HTML

<pre><code>&lt;div class=&quot;container&quot;&gt;<br/>    &lt;img rel=&quot;minibox&quot; src=&quot;http://placehold.it/300x300&quot; alt=&quot;&quot;&gt;<br/>    &lt;img rel=&quot;minibox&quot; src=&quot;http://placehold.it/350x350&quot; alt=&quot;&quot;&gt;<br/>    &lt;img rel=&quot;minibox&quot; src=&quot;http://placehold.it/400x400&quot; alt=&quot;&quot;&gt;<br/>    &lt;img rel=&quot;minibox&quot; src=&quot;http://placehold.it/450x450&quot; alt=&quot;&quot;&gt;<br/>&lt;/div&gt;</code></pre>

# Configuration Options

The following is the default configuration object

```
{
    showNavigation: true, // whether or not to show the navigation options at the bottom of the image
    showCloseButton: true, // whether or not to show the close button at the top-right of the page
    prevButton: 'css/previous.png', // the prev button image, if you want to change it
    nextButton: 'css/next.png', // the next button image, if you want to change it
    closeButton: 'css/close.png', // the close button image, if you want to change it
    keyCodeRight: 39, // the keyCode which will be equivalent to the next button
    keyCodeLeft: 37, // the keyCode which will be equivalent to the prev button
    keyCodeEscape: 27, // the keyCode which will be equivalent to the close button
    thumbails: { width: 0, height: 0 } // if you want to resize the images to make thumbails
}
```

## About thumbails
To create thumbails all you need to do is add the thumbails object to the 
configuration object. Only one attribute is required, width or height, if only
one is specified it will calculate the missing parameter to mantain aspect ratio
, if both are specified it will break the aspect ratio to match the given size.