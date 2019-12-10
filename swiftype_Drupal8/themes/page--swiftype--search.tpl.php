<div id="page" class="container <?php print $classes; ?>">
  <!-- region: Leaderboard -->
  <?php print render($page['leaderboard']); ?>

  <header<?php print $header_attributes; ?>>

    <!-- start: Branding -->
    <div<?php print $branding_attributes; ?>>
      <div class="show-desktop">
        <?php print render($page['sidebar_first']); ?>
      </div>
      <div class="show-responsive">
        <?php print render($page['sidebar_first_responsive']); ?>
      </div>
           <?php if ($site_logo): ?>
          <div id="logo">
            <?php print $site_logo; ?>
          </div>
        <?php endif; ?>
      <!--<div id="logo">  
        <a class="logo-header" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>">dsdsd</a>  
      </div>-->

      <?php if ($site_name || $site_slogan): ?>
        <!-- start: Site name and Slogan hgroup -->
        <hgroup<?php print $hgroup_attributes; ?>>

          <!--<?php if ($site_name): ?>
            <h1<?php print $site_name_attributes; ?>><?php print $site_name; ?></h1>
          <?php endif; ?>-->

          <a class="logo-slogan" href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>"></a> 

        </hgroup><!-- /end #name-and-slogan -->
      <?php endif; ?>

      <!-- region: Header -->
      <div class="show-desktop">
        <?php print render($page['header']); ?>
      </div>
      <div class="show-responsive">
        <?php print render($page['header_responsive']); ?>
      </div>

    </div><!-- /end #branding -->

    <!-- region: Highlighted -->
    <div class="show-desktop">
      <?php print render($page['highlighted']); ?>
    </div>
    <div class="show-responsive">
      <?php print render($page['highlighted_responsive']); ?>
    </div>

    <script>
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

      ga('create', 'UA-65003250-1', 'auto');
      ga('send', 'pageview');

    </script>       

  </header>

  <!-- Navigation elements -->
  <?php print render($page['menu_bar']); ?>
  <?php
  if ($primary_navigation): print $primary_navigation;
  endif;
  ?>
  <?php
  if ($secondary_navigation): print $secondary_navigation;
  endif;
  ?>

  <!-- Breadcrumbs -->
  <?php
  if ($breadcrumb): print $breadcrumb;
  endif;
  ?>
  <?php
  if ($breadcrumb2): print $breadcrumb2;
  endif;
  ?>

  <!-- Messages and Help -->
  <?php print $messages; ?>
  <?php print render($page['help']); ?>

  <!-- region: Secondary Content -->
  <?php print render($page['secondary_content']); ?>

  <div id="columns" class="columns clearfix">
    <div id="content-column" class="content-column" role="main">
      <div class="content-inner">


        <<?php print $tag; ?> id="main-content">

        <?php print render($title_prefix); // Does nothing by default in D7 core ?>

        <?php if ($title || $primary_local_tasks || $secondary_local_tasks || $action_links = render($action_links)): ?>
          <header<?php print $content_header_attributes; ?>>

            <?php if ($title): ?>
              <h1 id="page-title">
                <?php print html_entity_decode($title); ?> <span class="word"></span>
              </h1>
            <?php endif; ?>

            <?php if ($primary_local_tasks || $secondary_local_tasks || $action_links): ?>
              <div id="tasks">

                <?php if ($primary_local_tasks): ?>
                  <ul class="tabs primary clearfix"><?php print render($primary_local_tasks); ?></ul>
                <?php endif; ?>

                <?php if ($secondary_local_tasks): ?>
                  <ul class="tabs secondary clearfix"><?php print render($secondary_local_tasks); ?></ul>
                <?php endif; ?>

                <?php if ($action_links = render($action_links)): ?>
                  <ul class="action-links clearfix"><?php print $action_links; ?></ul>
                <?php endif; ?>

              </div>
            <?php endif; ?>

          </header>
        <?php endif; ?>

        <!-- region: Main Content -->
        <div id="content" class="region">
          <?php
          print render($page['content']);
          print render($page['content_mob']);
          print render($page['content_tab']);
          ?>
        </div>

        <!-- Feed icons (RSS, Atom icons etc -->

        <?php print render($title_suffix); // Prints page level contextual links   ?>

        </<?php print $tag; ?>><!-- /end #main-content -->

        <!-- region: Content Aside -->
        <?php print render($page['content_aside']); ?>

      </div><!-- /end .content-inner -->
    </div><!-- /end #content-column -->

    <!-- regions: Sidebar first and Sidebar second -->
    <?php
    $sidebar_second = render($page['sidebar_second']);
    print $sidebar_second;
    ?>

  </div><!-- /end #columns -->

  <!-- region: Tertiary Content -->
  <?php print render($page['tertiary_content']); ?>

  <!-- region: Footer -->
  <?php if ($page['footer']): ?>
    <footer<?php print $footer_attributes; ?>>
      <?php print render($page['footer']); ?>
    </footer>
  <?php endif; ?>

</div>

