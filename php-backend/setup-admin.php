<?php
/**
 * ONE-TIME ADMIN SETUP SCRIPT
 * Upload this to your server, visit it once in browser, then DELETE it immediately.
 */
header("Content-Type: application/json");

// Load .env automatically if it exists in parent dir or current dir
$env_paths = [dirname(__DIR__) . '/.env', __DIR__ . '/.env'];
foreach ($env_paths as $env_file) {
    if (file_exists($env_file)) {
        $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value, " \t\n\r\0\x0B\"'");
                if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                    putenv(sprintf('%s=%s', $name, $value));
                    $_ENV[$name] = $value;
                    $_SERVER[$name] = $value;
                }
            }
        }
    }
}

$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: '';
$user = getenv('DB_USER') ?: '';
$pass = getenv('DB_PASS') ?: '';
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';

if (!$db || !$user || !$pass) {
    if (!file_exists(__DIR__ . '/config.php')) {
        die(json_encode(["status" => "install_required", "message" => "Database not configured. Please visit /install to set up the database."]));
    }
    require_once __DIR__ . '/config.php';
    $host = defined('DB_HOST') ? DB_HOST : $host;
    $db = defined('DB_NAME') ? DB_NAME : $db;
    $user = defined('DB_USER') ? DB_USER : $user;
    $pass = defined('DB_PASS') ? DB_PASS : $pass;
    $charset = defined('DB_CHARSET') ? DB_CHARSET : $charset;
}

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
}
catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "DB connection failed"]));
}

$admin_email = getenv('ADMIN_EMAIL') ?: 'team@netmaxin.com';
$admin_password = getenv('ADMIN_PASS') ?: 'Niharika@003';
$admin_name = getenv('ADMIN_NAME') ?: 'Netmaxin Admin';

// CRITICAL: Fix role column from old ENUM to VARCHAR first
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'customer'");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("UPDATE users SET role = 'customer' WHERE role = 'user'");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN password_reset TINYINT DEFAULT 0");
}
catch (PDOException $e) {
}

// Check if account already exists
$stmt = $pdo->prepare("SELECT id, role FROM users WHERE email = ?");
$stmt->execute([$admin_email]);
$existing = $stmt->fetch();

if ($existing) {
    // Account exists — just upgrade to admin
    $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$existing['id']]);
    echo json_encode([
        "status" => "success",
        "message" => "Existing account upgraded to admin!",
        "email" => $admin_email,
        "previous_role" => $existing['role'],
        "new_role" => "admin"
    ]);
}
else {
    // Create new admin account
    $hash = password_hash($admin_password, PASSWORD_DEFAULT);
    $pdo->prepare("INSERT INTO users (name, email, password, role, coins) VALUES (?, ?, ?, 'admin', 100)")
        ->execute([$admin_name, $admin_email, $hash]);
    echo json_encode([
        "status" => "success",
        "message" => "Admin account created successfully!",
        "email" => $admin_email,
        "name" => $admin_name,
        "role" => "admin"
    ]);
}

echo "\n\n⚠️ DELETE THIS FILE FROM YOUR SERVER IMMEDIATELY FOR SECURITY!";
?>