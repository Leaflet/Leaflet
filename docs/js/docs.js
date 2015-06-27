
var tocCopy = document.createElement('div');
tocCopy.id = 'toc-copy';
tocCopy.innerHTML = document.querySelector('.api-page #toc').innerHTML;

document.getElementsByClassName('container')[0].appendChild(tocCopy);

var menus = document.querySelectorAll('#toc-copy ul');

for (var i = 0; i < menus.length; i++) {
  menus[i].addEventListener('mouseover', function() {
    console.log('over');
    this.previousElementSibling.classList.add('hover')
  });

  menus[i].addEventListener('mouseout', function() {
    console.log('out');
    this.previousElementSibling.classList.remove('hover')
  });
}

var scrollPos = function scrollPos () {
  var scroll = window.scrollY;

  if (scroll >= 810) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
}

scrollPos();

window.addEventListener('scroll', function(e) {
  scrollPos();
});

