<?php

/** alternative array column does not exists */
/**
 * This file is part of the array_column library
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) Ben Ramsey (http://benramsey.com)
 * @license http://opensource.org/licenses/MIT MIT
 */
if (!function_exists('array_column')) {
  /**
   * Returns the values from a single column of the input array, identified by
   * the $columnKey.
   *
   * Optionally, you may provide an $indexKey to index the values in the returned
   * array by the values from the $indexKey column in the input array.
   *
   * @param array $input A multi-dimensional array (record set) from which to pull
   *                     a column of values.
   * @param mixed $columnKey The column of values to return. This value may be the
   *                         integer key of the column you wish to retrieve, or it
   *                         may be the string key name for an associative array.
   * @param mixed $indexKey (Optional.) The column to use as the index/keys for
   *                        the returned array. This value may be the integer key
   *                        of the column, or it may be the string key name.
   * @return array
   */
  function array_column($input = null, $columnKey = null, $indexKey = null)
  {
      // Using func_get_args() in order to check for proper number of
      // parameters and trigger errors exactly as the built-in array_column()
      // does in PHP 5.5.
      $argc = func_num_args();
      $params = func_get_args();
      if ($argc < 2) {
          trigger_error("array_column() expects at least 2 parameters, {$argc} given", E_USER_WARNING);
          return null;
      }
      if (!is_array($params[0])) {
          trigger_error(
              'array_column() expects parameter 1 to be array, ' . gettype($params[0]) . ' given',
              E_USER_WARNING
          );
          return null;
      }
      if (!is_int($params[1])
          && !is_float($params[1])
          && !is_string($params[1])
          && $params[1] !== null
          && !(is_object($params[1]) && method_exists($params[1], '__toString'))
      ) {
          trigger_error('array_column(): The column key should be either a string or an integer', E_USER_WARNING);
          return false;
      }
      if (isset($params[2])
          && !is_int($params[2])
          && !is_float($params[2])
          && !is_string($params[2])
          && !(is_object($params[2]) && method_exists($params[2], '__toString'))
      ) {
          trigger_error('array_column(): The index key should be either a string or an integer', E_USER_WARNING);
          return false;
      }
      $paramsInput = $params[0];
      $paramsColumnKey = ($params[1] !== null) ? (string) $params[1] : null;
      $paramsIndexKey = null;
      if (isset($params[2])) {
          if (is_float($params[2]) || is_int($params[2])) {
              $paramsIndexKey = (int) $params[2];
          } else {
              $paramsIndexKey = (string) $params[2];
          }
      }
      $resultArray = array();
      foreach ($paramsInput as $row) {
          $key = $value = null;
          $keySet = $valueSet = false;
          if ($paramsIndexKey !== null && array_key_exists($paramsIndexKey, $row)) {
              $keySet = true;
              $key = (string) $row[$paramsIndexKey];
          }
          if ($paramsColumnKey === null) {
              $valueSet = true;
              $value = $row;
          } elseif (is_array($row) && array_key_exists($paramsColumnKey, $row)) {
              $valueSet = true;
              $value = $row[$paramsColumnKey];
          }
          if ($valueSet) {
              if ($keySet) {
                  $resultArray[$key] = $value;
              } else {
                  $resultArray[] = $value;
              }
          }
      }
      return $resultArray;
  }
}

/**
 * @file
 * Swiftype integration module admin functions.
 */

/**
 * Swiftype module admin form.
 */
function swiftype_integration_configure_api_keys_form($form, &$form_state) {
  $form['swiftype_integration_install_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Swiftype install key'),
    '#description' => t('Enter your Swiftype install key'),
    '#default_value' => variable_get('swiftype_integration_install_key'),
    '#size' => 20,
    '#maxlength' => 20,
    '#required' => TRUE,
  );
  $form['swiftype_integration_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Swiftype api key'),
    '#description' => t('Enter your Swiftype api key'),
    '#default_value' => variable_get('swiftype_integration_api_key'),
    '#size' => 20,
    '#maxlength' => 20,
    '#required' => TRUE,
  );
  $form['swiftype_integration_engine_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Swiftype engine key'),
    '#description' => t('Enter your Swiftype engine key'),
    '#default_value' => variable_get('swiftype_integration_engine_key'),
    '#size' => 20,
    '#maxlength' => 20,
    '#required' => TRUE,
  );
  return system_settings_form($form);
}

/**
 * Swiftype admin form validation.
 */
function swiftype_integration_configure_api_keys_form_validate($form, &$form_state) {
  $api_key = $form_state['values']['swiftype_integration_install_key'];
  $pattern = '/^[a-zA-Z0-9-_]+$/';

  if (!preg_match($pattern, $api_key)) {
    form_set_error('swiftype_integration_install_key', t('Swiftype install key should contain only letters and numbers'));
  }

  if (drupal_strlen($api_key) != 20) {
    form_set_error('swiftype_integration_install_key', t('Swiftype install key should be 20 characters long'));
  }
}

function swiftype_integration_index_form($form, &$form_state) {
  $form['swiftype_integration_ct_label'] = array(
    '#markup' => '<label>'.t('By cliking on the button, the indexing will start.').'</label><br>'.t('All PDF files from the content types selected will be have their metadata created/updated (language and document_type).').'<br><br>'
  );
  $form['submit_button'] = array(
    '#type' => 'submit',
    '#value' => t('Start indexing'),
    '#ajax' => array(
      'callback' => 'swiftype_update_documents',
      'wrapper' => 'index-form',
      'progress' => array(
          'type' => 'bar',
          'message' => t('Indexing...'),
          'url' => '/swiftype/indexing/progress', //url to fetch current progress percentage
          'interval' => '1000' //progress bar will refresh in 1 second
      )
    ),
  );
  $form['swiftype_progress_status'] = array(
    '#markup' => '<div id="progress-status"></div>'
  );
  return $form;
}

function swiftype_integration_configure_node_types_form($form, &$form_state) {
  $form['swiftype_integration_ct_label'] = array(
    '#markup' => '<label>'.t('Content types popularity order').'</label>'
  );

  $form['swiftype_integration_ct'] = array(
    '#prefix' => '<div id="swiftype-ct-attributes">',
    '#suffix' => '</div>',
    '#tree' => TRUE,
    '#theme' => 'swiftype_integration_components',
  );

  $cts = variable_get('swiftype_integration_ct');
  $node_type_names = node_type_get_names();
  function cmp_weight($a, $b){
    return $a['disabled'] > $b['disabled'] ? 1 : ( $a['weight'] == $b['weight'] ? 0 : ( $a['weight'] < $b['weight'] ? -1 : 1 ) );
    if ($a['weight'] == $b['weight']) {
      return 0;
    }
    return ($a['weight'] < $b['weight']) ? -1 : 1;
  }
  array_multisort(array_column($cts, 'disabled'),  SORT_ASC,
                array_column($cts, 'weight'), SORT_ASC,
                $cts);

  $nb=0;
  if(!empty($cts)) {
    foreach($cts as $node_type => $node_data) {
      $form['swiftype_integration_ct'][$node_type]['label'] = array(
        '#type' => 'item',
        '#markup' => $node_type_names[$node_type] /*. ' ('.t($node_data['title']).')'*/
      );
      $form['swiftype_integration_ct'][$node_type]['title'] = array(
        '#type' => 'textfield',
        '#default_value' => $node_data['title']!=""?$node_data['title']:"",
        '#size' => 20,
      ); 
      $form['swiftype_integration_ct'][$node_type]['elems'] = array(
        '#type' => 'textfield',
        '#default_value' => 0,
        '#size' => 2,
      ); 
      $form['swiftype_integration_ct'][$node_type]['disabled'] = array(
        '#type' => 'checkbox',
        '#default_value' => $node_data['disabled'],
        '#size' => 2,
      ); 
      $form['swiftype_integration_ct'][$node_type]['weight'] = array(
        '#type' => 'textfield',
        '#default_value' => $nb++,
        '#size' => 2,
        '#attributes' => array('class' => array('item-row-weight')),
      );
    }
  } else {
    foreach ($node_type_names as $node_type => $type_name) {
      if($cts[$node_type]) continue;
      $form['swiftype_integration_ct'][$node_type]['label'] = array(
        '#type' => 'item',
        '#markup' => $type_name
      );
      $form['swiftype_integration_ct'][$node_type]['title'] = array(
        '#type' => 'textfield',
        '#default_value' => "",
        '#size' => 20,
      ); 
      $form['swiftype_integration_ct'][$node_type]['elems'] = array(
        '#type' => 'textfield',
        '#default_value' => "",
        '#size' => 2,
      ); 
      $form['swiftype_integration_ct'][$node_type]['disabled'] = array(
        '#type' => 'checkbox',
        '#default_value' => 0,
        '#size' => 2,
      ); 
      $form['swiftype_integration_ct'][$node_type]['weight'] = array(
        '#type' => 'textfield',
        '#default_value' => $nb++,
        '#size' => 2,
        '#attributes' => array('class' => array('item-row-weight')),
      );
    }
  }
  $form['#attached']['js'][] = drupal_get_path('module', 'swiftype_integration') . '/includes/swiftype.admin.js';
  return system_settings_form($form);
}