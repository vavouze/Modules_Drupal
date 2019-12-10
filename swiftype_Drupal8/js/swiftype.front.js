/**
 * @file
 * Adds Swiftype Javascript code to the headers of the pages.
 */
var searchConfig = {
  facets: {},
  sort: {
    field: undefined,
    direction: undefined
  }
};
(function ($) {
  'use strict';
  Drupal.behaviors.swiftype_front = {
    attach: function (context, settings) {
      var url_logo=Drupal.settings.sitelogo.url_logo;
      var url_page=Drupal.settings.sitelogo.url_page;
      var url_download=Drupal.settings.sitelogo.url_download;
      var _prev=Drupal.settings.sitelogo.prev;
      var _next=Drupal.settings.sitelogo.next;
      var _loading=Drupal.settings.sitelogo.loading;
      
      /// Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or ISO-8859-1 with ISO-8859-1 cognates.
      var replaceWordChars = function(text) {
          if(text === undefined) return "";
          var s = text;
          // smart single quotes and apostrophe
          s = s.replace(/[\u2018\u2019\u201A]/g, "\'");
          // smart double quotes
          s = s.replace(/[\u201C\u201D\u201E]/g, "\"");
          // ellipsis
          s = s.replace(/\u2026/g, "...");
          // dashes
          s = s.replace(/[\u2013\u2014]/g, "-");
          // circumflex
          s = s.replace(/\u02C6/g, "^");
          // open angle bracket
          s = s.replace(/\u2039/g, "<");
          // close angle bracket
          s = s.replace(/\u203A/g, ">");
          // spaces
          s = s.replace(/[\u02DC\u00A0]/g, " ");
          
          //custom
          s = s.replace(/\uFFFD/g, '');

          return s;
      }
      
      var _lang = Drupal.settings.site_language;
      var _excl="";
      switch(_lang) {
        case 'fr':_excl="!en";break;
        case 'en':_excl="!fr";break;
      }

      var resultTemplate = Hogan.compile([
        "<div class='page'>",
          "<a href='{{url}}' target='{{is_file}}'>",
          "<img class='imgpage' src='{{image}}' alt='' />",
          "<div>",
          "<h2>{{{info}}}</h2>",
          "<p>{{{subject}}}</p>",
          "</div>",
          "</a>",
        "</div>"
      ].join('') );

      var getPathFromUrl = function(url) {
        return url.split(/[?#]/)[0];
      }

      var customRenderFunction = function(document_type, item, document_info) {
        var regex = new RegExp(document_info.page.query);
        var subject, image, info, is_file;
        info = (/\.(pdf)$/i).test(item['url'])?item['url'].split(/[\\/]/).pop():(item['info']!=""?(item['highlight'].info?item['highlight'].info:item['info']):(item['highlight'].title?item['highlight'].title:item['title']));
        image = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(getPathFromUrl(item['image']))?item['image']:((/\.(pdf)$/i).test(item['url'])?url_download:url_page);

        var _subject="", _body="";
        if(item['subject']!=""&&item['subject']!==undefined) _subject = (item['highlight'].subject?item['highlight'].subject:item['subject']);
        _body = replaceWordChars(item['highlight'].body?item['highlight'].body:item['body']).split(" ").splice(0, 60).join(" ")+"...";
        var highlight = regex.test(_subject)||!regex.test(_body)?_subject:_body;
        subject = (/\.(pdf)$/i).test(item['url'])?(replaceWordChars(item['highlight'].body).split(" ").splice(0, 30).join(" ")+"..."):highlight;

        is_file = (/\.(pdf)$/i).test(item['url'])?"_blank":"_self";
        var
          data = {
            info: info,
            image: image,
            subject: subject,
            type: item['type'],
            url: item['url'],
            is_file: is_file
          };
        return resultTemplate.render(data);
      };

      var $facetContainer = $('.st-dynamic-facets');

      var reloadResults = function() {
        $(window).hashchange();
      };

      var bindControls = function(data) {
        var
          resultInfo = data['info'],
          facets = '';
        $('.word').html(data['info']['page']['query']);
        var crumb_title = ' <span class="result_term">'+data['info']['page']['query']+'</span>';
        $('.crumb-title').find('span').remove();
        $('.crumb-title').append(crumb_title);
        $.each(resultInfo, function(documentType, typeInfo){
          $.each(typeInfo.facets, function(field, facetCounts) {
            facets += ['<div class="facet"><h3>', /*field*/ "type", '</h3></div>'].join('')
            $.each(facetCounts, function(label, count) {
              var
                status = "",
                id = encodeURIComponent(label).toLowerCase();
              if (window.searchConfig.facets[field] && window.searchConfig.facets[field].indexOf(label) > -1) {
                status = 'checked="checked"'
              }

              facets += '<input type="checkbox"' + status + ' name="' + field + '" value="' + label + '" id="' + id + '"> <label for="' + id + '">' + (label!=""?label:"Documents") + ' (' + count + ')</label><br/>';
            });
            // facets += '<a href="#" class="clear-selection" data-name="' + field + '">Clear all</a>'
          });
          $facetContainer.html(facets);
        });
      };

      var readSortField = function() {
        return { page: window.searchConfig.sort.field };
      };

      var readSortDirection = function() {
        return { page: window.searchConfig.sort.direction };
      };

      $('.sort').on('click', function(e){
        e.preventDefault();
        // Visually change the selected sorting order
        $('.sort').removeClass('active');
        $(this).addClass('active');
        // Update sorting settings
        window.searchConfig.sort.field = $(this).data('field');
        window.searchConfig.sort.direction = $(this).data('direction');

        reloadResults();
      });

      $facetContainer.on('click', 'input', function(e) {
        window.searchConfig.facets = {}; // Set the hash to empty
        $('.st-dynamic-facets input[type="checkbox"]').each(function(idx, obj) {
          var
            $checkbox = $(obj),
            facet = $checkbox.prop('name');
          if(!window.searchConfig.facets[facet]) {
            window.searchConfig.facets[facet] = [];
          }
          if($checkbox.prop('checked')) {
            window.searchConfig.facets[facet].push($checkbox.prop('value'));
          }
        })

        reloadResults();
      });

      $facetContainer.on('click', 'a.clear-selection', function(e) {
        e.preventDefault();
        var name = $(this).data('name');
        $('input[name=' + name + ']').prop('checked', false);
        window.searchConfig.facets[name] = [];

        reloadResults();
      });

      var readFilters = function() {
        return {
          page: {
            document_type: window.searchConfig.facets['document_type'],
            language : [_excl]
          }
        }
      }

      var onComplete = function(a,b,c,d,e) {
        console.log(a);
        console.log(b);
        console.log(c);
        console.log(d);
        console.log(e);
      }

      $('#st-search-input-advanced').swiftypeSearch({
        resultContainingElement: '#st-results-container',
        engineKey: Drupal.settings.swiftype_integration_engine_key,
        renderFunction: customRenderFunction,
        fetchFields: { 'page': ['url','info', 'subject', 'image', 'title', 'body', 'language', 'filetype'] },
        highlightFields: { 'page': { 'info': { 'size': 120, 'fallback': true }, 'subject': { 'size': 250, 'fallback': true }, 'body': { 'size': 250, 'fallback': true } } },
        searchFields: { 'page': ['url', 'info', 'subject', 'body', 'title', 'language'] },
        facets: { page: ['document_type'] },
        sortField: readSortField,
        sortDirection: readSortDirection,
        filters: readFilters,
        postRenderFunction: bindControls,
        prev: _prev,
        next: _next,
        loading: _loading,
      });


      /**** SEARCH BAR ****/
      $('#st-search-input, #st-search-input-m').swiftype({
        renderFunction: customRenderFunction,
        fetchFields: { 'page': ['url','info', 'subject', 'image', 'title', 'body', 'language', 'filetype'] },
        highlightFields: { 'page': { 'info': { 'size': 120, 'fallback': true }, 'subject': { 'size': 250, 'fallback': true }, 'body': { 'size': 250, 'fallback': true } } },
        searchFields: { 'page': ['url', 'info', 'subject', 'body', 'title', 'language'] },
        filters: {
          "page" : {
            "language" : [_excl]
          }
        },
        engineKey: Drupal.settings.swiftype_integration_engine_key,
        resultLimit: 10
      });

      /** form **/
      $("#swiftype-search").off('submit').submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var query = $('input[name="stq"]').val();
        window.location.href = $(this).attr('action')+'#stq='+query;
        return false;
      });
      
      $("#swiftype-search-mobile").off('submit').submit(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var query = $('input[name="stqm"]').val();
        window.location.href = $(this).attr('action')+'#stq='+query;
        return false;
      }); 
    }
  };
})(jQuery);
