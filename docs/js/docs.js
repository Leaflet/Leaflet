
var tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';

var toc = document.querySelector('.api-page #toc');

if (toc) {
  tocCopy.innerHTML = toc.innerHTML;
  document.getElementsByClassName('container')[0].appendChild(tocCopy);

  var menus = document.querySelectorAll('#toc-copy ul');

  for (var i = 0; i < menus.length; i++) {
    menus[i].addEventListener('mouseover', function() {
      this.previousElementSibling.classList.add('hover')
    });

    menus[i].addEventListener('mouseout', function() {
      this.previousElementSibling.classList.remove('hover')
    });
  }

  var scrollPos = function scrollPos () {
    var scroll = window.scrollY;

    if (scroll >= (toc.offsetHeight + toc.offsetTop)) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }

  scrollPos();

  window.addEventListener('scroll', function(e) {
    scrollPos();
  });
}


