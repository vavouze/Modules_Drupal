/**
 * @file
 * Adds Swiftype Javascript code to the headers of the pages.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';
  Drupal.behaviors.swiftype_integration = {
    attach: function (context, settings) {
      (function (w, d, t, u, n, s, e) {
        w['SwiftypeObject'] = n;
        w[n] = w[n] || function () {
          (w[n].q = w[n].q || []).push(arguments);
        };
        s = d.createElement(t);
        e = d.getElementsByTagName(t)[0];
        s.async = 1;
        s.src = u;
        e.parentNode.insertBefore(s, e);
      })(window, document, 'script', '//s.swiftypecdn.com/install/v2/st.js', '_st');

      _st('install', drupalSettings.swiftype_integration.install_key, '2.0.0');
    }
  };
})(jQuery, Drupal, drupalSettings);
