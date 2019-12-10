/**
 * @file
 * Adds Swiftype Javascript code to the headers of the pages.
 */

(function ($) {
  'use strict';
  Drupal.behaviors.swiftype_ct_admin = {
    attach: function (context, settings) {
      // console.log($('#swiftype-ct-attributes input.form-checkbox'));
      $('#swiftype-ct-attributes input.form-checkbox').on('change', function(e) {
        if(this.checked) {
          $(this).parents('tr').addClass('disabledct');
        } else {
          $(this).parents('tr').removeClass('disabledct');
        }
      });
    }
  };
})(jQuery);