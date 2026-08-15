(function () {
  'use strict';

  function setActiveLink(id) {
    var links = document.querySelectorAll(
      '.primary-nav a[href="#' + id + '"], .tabbar a[href="#' + id + '"]'
    );
    document.querySelectorAll('.primary-nav a, .tabbar a').forEach(function (a) {
      a.classList.remove('is-active');
      a.removeAttribute('aria-current');
    });
    links.forEach(function (a) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'true');
    });
  }

  function initScrollSpy() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('main section[id]')
    );
    if (!sections.length) {
      return;
    }

    var headerOffset = 110;

    function currentSectionId() {
      var doc = document.documentElement;
      var atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      if (atBottom) {
        return sections[sections.length - 1].id;
      }

      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        var top = sections[i].getBoundingClientRect().top;
        if (top - headerOffset <= 0) {
          current = sections[i].id;
        }
      }
      return current;
    }

    var ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(function () {
        setActiveLink(currentSectionId());
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initCopyButtons() {
    var copyLabel = document.body.dataset.copyLabel || 'Copy';
    var copiedLabel = document.body.dataset.copiedLabel || 'Copied!';

    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.code-block')) {
        return;
      }

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.textContent = copyLabel;
      button.addEventListener('click', function () {
        var text = pre.textContent.trim();
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = copiedLabel;
          setTimeout(function () {
            button.textContent = copyLabel;
          }, 1500);
        });
      });
      wrapper.appendChild(button);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollSpy();
    initCopyButtons();
  });
})();
