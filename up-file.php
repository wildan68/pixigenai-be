<?php
// create api for upload image from link

if (!isset($_GET['key'])) {
    // json
    header('Content-Type: application/json');
    echo json_encode(array(
        'status' => 'error',
        'message' => 'No key provided'
    ));
    exit;
}

if (!isset($_GET['url'])) {
    // json
    header('Content-Type: application/json');
    echo json_encode(array(
        'status' => 'error',
        'message' => 'No url provided'
    ));
    exit;
}

if ($_GET['key'] != 'wildananak12') {
    // json
    header('Content-Type: application/json');
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Invalid key'
    ));
    exit;
}

// get image url
$url = $_GET['url'];

// generate random string for image name
$random = substr(md5(mt_rand()), 0, 50);

// create image from url
$image = file_get_contents($url);

// if image failed to create
if (!$image) {
    // json
    header('Content-Type: application/json');
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Failed to get image'
    ));
    exit;
}

// get year
$year = date('Y');

// get month in number
$month = date('m');

// create folder year if not exist
if (!file_exists('wp-content/uploads/' . $year)) {
    mkdir('wp-content/uploads' . $year);
}

// create folder month if not exist
if (!file_exists('wp-content/uploads/' . $year . '/' . $month)) {
    mkdir('wp-content/uploads/' . $year . '/' . $month);
}

// save images
file_put_contents('wp-content/uploads/' . $year . '/' . $month . '/' . $random . '.jpg', $image);

// json
header('Content-Type: application/json');
echo json_encode(array(
    'status' => 'success',
    'message' => 'Image uploaded',
    'name' => $random,
    'url' => 'wp-content/uploads/' . $year . '/' . $month . '/' . $random . '.jpg'
));
exit;
?>