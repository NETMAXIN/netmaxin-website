<?php
/*
 * NETMAXIN DATABASE CONFIGURATION
 * This file contains the hardcoded MySQL credentials for Vercel deployment.
 * Do not commit this file to public repositories!
 */

// Hostinger DB Credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'u903487771_netmaxin');
define('DB_USER', 'u903487771_netmaxin');
define('DB_PASS', 'Niharika@6532');
define('DB_CHARSET', 'utf8mb4');

// Establish PDO Connection
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // If connection fails, output JSON error to cleanly inform frontend
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>
