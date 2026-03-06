<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
header("Content-Type: application/json");

// Handle CORS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

$configFile = __DIR__ . '/config.php';
$hasEnvConfig = getenv('DB_HOST') && getenv('DB_NAME') && getenv('DB_USER') && getenv('DB_PASS');

$data = json_decode(file_get_contents("php://input"));
$action = isset($data->action) ? $data->action : '';

if ($action === 'check') {
    if (file_exists($configFile) || $hasEnvConfig) {
        echo json_encode(["status" => "installed"]);
    } else {
        echo json_encode(["status" => "not_installed"]);
    }
    exit;
}

if (file_exists($configFile) || $hasEnvConfig) {
    echo json_encode(["status" => "error", "message" => "Already installed."]);
    exit;
}

$db_host = $data->db_host ?? 'localhost';
$db_name = $data->db_name ?? '';
$db_user = $data->db_user ?? '';
$db_pass = $data->db_pass ?? '';

try {
    $dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
    // Connection successful, write to config.php
    $configContent = "<?php\n";
    $configContent .= "\$host = " . var_export($db_host, true) . ";\n";
    $configContent .= "\$db = " . var_export($db_name, true) . ";\n";
    $configContent .= "\$user = " . var_export($db_user, true) . ";\n";
    $configContent .= "\$pass = " . var_export($db_pass, true) . ";\n";
    $configContent .= "\$charset = 'utf8mb4';\n";
    
    if (file_put_contents($configFile, $configContent)) {
        echo json_encode(["status" => "success", "message" => "Database configured successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to write config.php. Check folder permissions."]);
    }
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
}
?>
