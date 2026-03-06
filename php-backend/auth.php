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

// Hostinger Database Configuration
$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: '';
$user = getenv('DB_USER') ?: '';
$pass = getenv('DB_PASS') ?: '';
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';

// Fallback to config.php if not using .env
if (!$db || !$user || !$pass) {
    if (file_exists(__DIR__ . '/config.php')) {
        require_once __DIR__ . '/config.php';
    } else {
        echo json_encode(["status" => "install_required", "message" => "Database not configured. Please use .env or visit /install to set up the database."]);
        exit;
    }
}

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
}
catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Ensure users table exists automatically
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    company VARCHAR(255) NULL,
    position VARCHAR(255) NULL,
    role VARCHAR(50) DEFAULT 'customer',
    coins INT DEFAULT 0,
    password_reset TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Safely alter existing table to add any missing new columns
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NULL");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN last_name VARCHAR(255) NULL");
}
catch (PDOException $e) {
}

$pdo->exec("CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category VARCHAR(255) NULL,
    difficulty VARCHAR(50) NULL,
    duration VARCHAR(50) NULL,
    instructor_id INT NULL,
    price INT DEFAULT 0,
    modules INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published',
    students INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type VARCHAR(100) NULL,
    iconStr VARCHAR(100) DEFAULT 'Bell',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN phone VARCHAR(255) NULL");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN company VARCHAR(255) NULL");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN position VARCHAR(255) NULL");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN coins INT DEFAULT 0");
}
catch (PDOException $e) {
}
try {
    $pdo->exec("ALTER TABLE users ADD COLUMN password_reset TINYINT DEFAULT 0");
}
catch (PDOException $e) {
}
// CRITICAL: Modify role column from old ENUM to VARCHAR to support all roles
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'customer'");
}
catch (PDOException $e) {
}
// Migrate old 'user' role to 'customer'
// Migrate old 'user' role to 'customer'
try {
    $pdo->exec("UPDATE users SET role = 'customer' WHERE role = 'user'");
}
catch (PDOException $e) {
}

// Create Quotes table
$pdo->exec("CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NULL,
    company VARCHAR(255) NULL,
    message TEXT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Ensure transactions table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NULL,
    receiver_id INT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Blog submissions table
$pdo->exec("CREATE TABLE IF NOT EXISTS blog_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    status ENUM('draft','pending_review','reviewed','approved','published','rejected') DEFAULT 'draft',
    reviewed_by INT NULL,
    approved_by INT NULL,
    reviewer_note TEXT NULL,
    approver_note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Courses table
$pdo->exec("CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(50),
    duration VARCHAR(50),
    instructor VARCHAR(255),
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Enrollments table
$pdo->exec("CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Application tracking table
$pdo->exec("CREATE TABLE IF NOT EXISTS application_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    app_type VARCHAR(100) NOT NULL,
    app_title VARCHAR(500) NOT NULL,
    description TEXT NULL,
    status ENUM('submitted','in_progress','under_review','completed','rejected') DEFAULT 'submitted',
    assigned_to INT NULL,
    priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Password Reset Tokens
$pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Instructor Applications table
$pdo->exec("CREATE TABLE IF NOT EXISTS instructor_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    qualification TEXT NOT NULL,
    experience TEXT NULL,
    specialization VARCHAR(255) NULL,
    portfolio_url VARCHAR(500) NULL,
    status ENUM('submitted','pending_employee_review','employee_approved','manager_approved','approved','rejected') DEFAULT 'submitted',
    employee_note TEXT NULL,
    manager_note TEXT NULL,
    reviewed_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Anti-brute force / Rate Limiting table
$pdo->exec("CREATE TABLE IF NOT EXISTS rate_limits (
    ip_address VARCHAR(45) PRIMARY KEY,
    attempts INT DEFAULT 1,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// User Activity Logs table
$pdo->exec("CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    page VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) DEFAULT 'page_view',
    time_spent INT DEFAULT 0,
    device VARCHAR(255) NULL,
    browser VARCHAR(255) NULL,
    ip_address VARCHAR(45) NULL,
    referrer VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
)");

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';

// Rate Limiting Logic Check
$ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
if ($action === 'login' || $action === 'forgot_password') {
    $stmt = $pdo->prepare("SELECT attempts, last_attempt FROM rate_limits WHERE ip_address = ?");
    $stmt->execute([$ip]);
    $rl = $stmt->fetch();

    // Block if more than 10 attempts in the last 15 minutes
    if ($rl && $rl['attempts'] > 10 && strtotime($rl['last_attempt']) > time() - 900) {
        echo json_encode(["status" => "error", "message" => "Too many attempts. Please try again in 15 minutes."]);
        exit;
    }
}

// ========================
// AUTH ACTIONS
// ========================

if ($action === 'signup') {
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $password = $data->password ?? '';

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, coins) VALUES (?, ?, ?, 'user', 50)");
        $stmt->execute([$name, $email, $hash]);
        echo json_encode(["status" => "success", "message" => "Account created successfully"]);
    }
    catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["status" => "error", "message" => "Email already exists! Please Log In."]);
        }
        else {
            echo json_encode(["status" => "error", "message" => "Signup failed"]);
        }
    }
}
elseif ($action === 'login') {
    $email = filter_var($data->email ?? '', FILTER_SANITIZE_EMAIL);
    $password = $data->password ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Reset rate limit on success
        $pdo->prepare("DELETE FROM rate_limits WHERE ip_address = ?")->execute([$ip]);

        unset($user['password']);
        echo json_encode(["status" => "success", "message" => "Login successful", "user" => $user]);
    }
    else {
        // Increment rate limit
        $pdo->prepare("INSERT INTO rate_limits (ip_address) VALUES (?) ON DUPLICATE KEY UPDATE attempts = attempts + 1")->execute([$ip]);
        echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    }
}
elseif ($action === 'forgot_password') {
    $email = filter_var($data->email ?? '', FILTER_SANITIZE_EMAIL);

    if (!$email) {
        echo json_encode(["status" => "error", "message" => "Email required"]);
        exit;
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Generate Token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiration

        $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)")->execute([$email, $token, $expires]);

        // SMTP Configuration
        require 'phpmailer/Exception.php';
        require 'phpmailer/PHPMailer.php';
        require 'phpmailer/SMTP.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            // Updated SMTP details
            $mail->isSMTP();
            $mail->Host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = getenv('SMTP_USER') ?: 'noreply@netmaxin.com';
            $mail->Password = getenv('SMTP_PASS') ?: 'Niharika@6532';
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = getenv('SMTP_PORT') ?: 465;

            $mail->setFrom(getenv('SMTP_FROM_EMAIL') ?: 'noreply@netmaxin.com', getenv('SMTP_FROM_NAME') ?: 'Netmaxin');
            $mail->addAddress($email, $user['name']);

            $resetLink = "https://netmaxin.com/login?reset_token=" . $token . "&email=" . urlencode($email);

            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request - Netmaxin';
            $mail->Body = "Hello {$user['name']},<br><br>You requested a password reset. Please click the link below to set a new password:<br><br><a href='{$resetLink}'>Reset Password</a><br><br>If you did not request this, please ignore this email.";

            // Note: If SMTP isn't setup correctly, this will fail. We'll catch and return a polite error.
            $mail->send();
            echo json_encode(["status" => "success", "message" => "A password reset link has been sent to your email."]);
        }
        catch (Exception $e) {
            // Fallback to PHP mail() if SMTP fails
            $headers = "From: noreply@netmaxin.com\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $subject = 'Password Reset Request - Netmaxin';
            $message = "Hello {$user['name']},<br><br>You requested a password reset. Please click the link below to set a new password:<br><br><a href='{$resetLink}'>Reset Password</a><br><br>If you did not request this, please ignore this email.";
            mail($email, $subject, $message, $headers);

            echo json_encode(["status" => "success", "message" => "A password reset link has been sent to your email (fallback mailer)."]);
        }
    }
    else {
        // Prevent user enumeration by sending success anyway
        echo json_encode(["status" => "success", "message" => "If the email is registered, a password reset link has been sent."]);
    }
}
elseif ($action === 'verify_reset_password') {
    $email = filter_var($data->email ?? '', FILTER_SANITIZE_EMAIL);
    $token = $data->token ?? '';
    $new_password = $data->new_password ?? '';

    if (!$email || !$token || !$new_password) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$email, $token]);
    $reset = $stmt->fetch();

    if ($reset) {
        $hash = password_hash($new_password, PASSWORD_DEFAULT);
        $pdo->prepare("UPDATE users SET password = ? WHERE email = ?")->execute([$hash, $email]);
        // Delete all reset tokens for this user
        $pdo->prepare("DELETE FROM password_resets WHERE email = ?")->execute([$email]);
        echo json_encode(["status" => "success", "message" => "Password updated successfully. You can now login."]);
    }
    else {
        echo json_encode(["status" => "error", "message" => "Invalid or expired reset token."]);
    }
}
elseif ($action === 'update_profile') {
    $id = $data->id ?? '';
    if (!$id) {
        echo json_encode(["status" => "error", "message" => "User ID required"]);
        exit;
    }

    $display_name = $data->name ?? '';
    $first_name = $data->first_name ?? '';
    $last_name = $data->last_name ?? '';
    $phone = $data->phone ?? '';
    $company = $data->company ?? '';
    $position = $data->position ?? '';

    try {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, first_name = ?, last_name = ?, phone = ?, company = ?, position = ? WHERE id = ?");
        $stmt->execute([$display_name, $first_name, $last_name, $phone, $company, $position, $id]);

        $fetch_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $fetch_stmt->execute([$id]);
        $updated_user = $fetch_stmt->fetch();
        unset($updated_user['password']);

        echo json_encode(["status" => "success", "message" => "Profile updated successfully", "user" => $updated_user]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }
}
elseif ($action === 'transfer_coins') {
    $sender_id = $data->sender_id ?? '';
    $receiver_netmaxin_id = $data->receiver_netmaxin_id ?? '';
    $amount = intval($data->amount ?? 0);

    if (!$sender_id || !$receiver_netmaxin_id || $amount <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid transfer details"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT coins FROM users WHERE id = ? FOR UPDATE");
        $stmt->execute([$sender_id]);
        $sender = $stmt->fetch();

        if (!$sender || $sender['coins'] < $amount) {
            $pdo->rollBack();
            echo json_encode(["status" => "error", "message" => "Insufficient coins"]);
            exit;
        }

        if (preg_match('/^NM-920(\d+)$/', $receiver_netmaxin_id, $matches)) {
            $extracted_id = intval($matches[1]);
            $stmt2 = $pdo->prepare("SELECT id FROM users WHERE id = ? FOR UPDATE");
            $stmt2->execute([$extracted_id]);
        }
        else {
            $pdo->rollBack();
            echo json_encode(["status" => "error", "message" => "Invalid Netmaxin ID format. Must be NM-920XXXXX"]);
            exit;
        }
        $receiver = $stmt2->fetch();

        if (!$receiver) {
            $pdo->rollBack();
            echo json_encode(["status" => "error", "message" => "Receiver not found"]);
            exit;
        }

        if ($receiver['id'] == $sender_id) {
            $pdo->rollBack();
            echo json_encode(["status" => "error", "message" => "Cannot transfer coins to yourself"]);
            exit;
        }

        $pdo->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$amount, $sender_id]);
        $pdo->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$amount, $receiver['id']]);

        $pdo->prepare("INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (?, ?, ?)")
            ->execute([$sender_id, $receiver['id'], $amount]);

        $pdo->commit();

        $fetch_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $fetch_stmt->execute([$sender_id]);
        $updated_user = $fetch_stmt->fetch();
        unset($updated_user['password']);

        echo json_encode(["status" => "success", "message" => "Transfer complete!", "user" => $updated_user]);
    }
    catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "Transfer failed contextually"]);
    }
}
elseif ($action === 'change_email') {
    $id = $data->id ?? '';
    $new_email = $data->new_email ?? '';
    $current_password = $data->current_password ?? '';

    if (!$id || !$new_email || !$current_password) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    if ($user && password_verify($current_password, $user['password'])) {
        try {
            $update_stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
            $update_stmt->execute([$new_email, $id]);

            $fetch_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $fetch_stmt->execute([$id]);
            $updated_user = $fetch_stmt->fetch();
            unset($updated_user['password']);

            echo json_encode(["status" => "success", "message" => "Email updated successfully", "user" => $updated_user]);
        }
        catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                echo json_encode(["status" => "error", "message" => "Email already exists"]);
            }
            else {
                echo json_encode(["status" => "error", "message" => "Failed to update email"]);
            }
        }
    }
    else {
        echo json_encode(["status" => "error", "message" => "Incorrect current password"]);
    }
}
elseif ($action === 'change_password') {
    $id = $data->id ?? '';
    $new_password = $data->new_password ?? '';
    $current_password = $data->current_password ?? '';

    if (!$id || !$new_password || !$current_password) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch();

    if ($user && password_verify($current_password, $user['password'])) {
        $hash = password_hash($new_password, PASSWORD_DEFAULT);
        try {
            $update_stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $update_stmt->execute([$hash, $id]);
            echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
        }
        catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Failed to update password"]);
        }
    }
    else {
        echo json_encode(["status" => "error", "message" => "Incorrect current password"]);
    }
}
elseif ($action === 'get_transactions') {
    $user_id = $data->user_id ?? '';

    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT t.*, 
                   s.email as sender_email, s.name as sender_name,
                   r.email as receiver_email, r.name as receiver_name
            FROM transactions t
            LEFT JOIN users s ON t.sender_id = s.id
            LEFT JOIN users r ON t.receiver_id = r.id
            WHERE t.sender_id = ? OR t.receiver_id = ?
            ORDER BY t.created_at DESC
        ");
        $stmt->execute([$user_id, $user_id]);
        $transactions = $stmt->fetchAll();

        echo json_encode(["status" => "success", "transactions" => $transactions]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch transactions"]);
    }
}

// ========================
// ROLE MANAGEMENT (Admin Only)
// ========================

elseif ($action === 'update_user_role') {
    $admin_id = $data->admin_id ?? '';
    $target_user_id = $data->target_user_id ?? '';
    $new_role = $data->new_role ?? '';

    if (!$admin_id || !$target_user_id || !$new_role) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    // Verify requester is admin
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$admin_id]);
    $admin = $stmt->fetch();

    if (!$admin || $admin['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "Unauthorized: Admin access required"]);
        exit;
    }

    $valid_roles = ['admin', 'manager', 'employee', 'user', 'customer', 'instructor'];
    if (!in_array($new_role, $valid_roles)) {
        echo json_encode(["status" => "error", "message" => "Invalid role"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$new_role, $target_user_id]);
        echo json_encode(["status" => "success", "message" => "Role updated successfully"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update role"]);
    }
}

elseif ($action === 'get_all_users') {
    $requester_id = $data->requester_id ?? '';

    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "Requester ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();

    if (!$requester || !in_array($requester['role'], ['admin', 'manager'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, first_name, last_name, phone, company, position, role, coins, created_at FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $users = $stmt->fetchAll();
        echo json_encode(["status" => "success", "users" => $users]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch users"]);
    }
}

// ========================
// BLOG SUBMISSION WORKFLOW
// ========================

elseif ($action === 'submit_blog') {
    // Users submit a blog for publication
    $author_id = $data->author_id ?? '';
    $title = $data->title ?? '';
    $excerpt = $data->excerpt ?? '';
    $content = $data->content ?? '';
    $category = $data->category ?? 'General';

    if (!$author_id || !$title || !$content) {
        echo json_encode(["status" => "error", "message" => "Title and content are required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO blog_submissions (author_id, title, excerpt, content, category, status) VALUES (?, ?, ?, ?, ?, 'pending_review')");
        $stmt->execute([$author_id, $title, $excerpt, $content, $category]);
        echo json_encode(["status" => "success", "message" => "Blog submitted for review!"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to submit blog"]);
    }
}

elseif ($action === 'get_my_blogs') {
    // Users see their own blog submissions
    $author_id = $data->author_id ?? '';

    if (!$author_id) {
        echo json_encode(["status" => "error", "message" => "Author ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT bs.*, u.name as author_name, u.email as author_email,
                   r.name as reviewer_name, a.name as approver_name
            FROM blog_submissions bs
            LEFT JOIN users u ON bs.author_id = u.id
            LEFT JOIN users r ON bs.reviewed_by = r.id
            LEFT JOIN users a ON bs.approved_by = a.id
            WHERE bs.author_id = ?
            ORDER BY bs.created_at DESC
        ");
        $stmt->execute([$author_id]);
        $blogs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "blogs" => $blogs]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch blogs"]);
    }
}

elseif ($action === 'get_pending_blogs') {
    // Employees see blogs pending review; Managers see blogs pending approval
    $requester_id = $data->requester_id ?? '';

    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "Requester ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();

    if (!$requester) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    try {
        $status_filter = '';
        if ($requester['role'] === 'employee') {
            $status_filter = "WHERE bs.status = 'pending_review'";
        }
        elseif ($requester['role'] === 'manager') {
            $status_filter = "WHERE bs.status IN ('pending_review','reviewed','approved')";
        }
        elseif ($requester['role'] === 'admin') {
            $status_filter = ""; // Admin sees all
        }
        else {
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT bs.*, u.name as author_name, u.email as author_email,
                   r.name as reviewer_name, a.name as approver_name
            FROM blog_submissions bs
            LEFT JOIN users u ON bs.author_id = u.id
            LEFT JOIN users r ON bs.reviewed_by = r.id
            LEFT JOIN users a ON bs.approved_by = a.id
            $status_filter
            ORDER BY bs.created_at DESC
        ");
        $stmt->execute();
        $blogs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "blogs" => $blogs]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch blogs"]);
    }
}

elseif ($action === 'review_blog') {
    // Employee reviews a blog and sends it to manager for approval
    $reviewer_id = $data->reviewer_id ?? '';
    $blog_id = $data->blog_id ?? '';
    $reviewer_note = $data->reviewer_note ?? '';
    $decision = $data->decision ?? ''; // 'approve' or 'reject'

    if (!$reviewer_id || !$blog_id || !$decision) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$reviewer_id]);
    $reviewer = $stmt->fetch();

    if (!$reviewer || !in_array($reviewer['role'], ['employee', 'admin'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized: Employee access required"]);
        exit;
    }

    try {
        if ($decision === 'approve') {
            $stmt = $pdo->prepare("UPDATE blog_submissions SET status = 'reviewed', reviewed_by = ?, reviewer_note = ? WHERE id = ? AND status = 'pending_review'");
        }
        else {
            $stmt = $pdo->prepare("UPDATE blog_submissions SET status = 'rejected', reviewed_by = ?, reviewer_note = ? WHERE id = ? AND status = 'pending_review'");
        }
        $stmt->execute([$reviewer_id, $reviewer_note, $blog_id]);
        echo json_encode(["status" => "success", "message" => $decision === 'approve' ? "Blog forwarded to manager for approval" : "Blog rejected"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to review blog"]);
    }
}

elseif ($action === 'approve_blog') {
    // Manager approves and publishes a blog
    $approver_id = $data->approver_id ?? '';
    $blog_id = $data->blog_id ?? '';
    $approver_note = $data->approver_note ?? '';
    $decision = $data->decision ?? ''; // 'publish' or 'reject'

    if (!$approver_id || !$blog_id || !$decision) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$approver_id]);
    $approver = $stmt->fetch();

    if (!$approver || !in_array($approver['role'], ['manager', 'admin'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized: Manager access required"]);
        exit;
    }

    try {
        if ($decision === 'publish') {
            $stmt = $pdo->prepare("UPDATE blog_submissions SET status = 'published', approved_by = ?, approver_note = ? WHERE id = ? AND status = 'reviewed'");
            $stmt->execute([$approver_id, $approver_note, $blog_id]);

            // Award coins to author for published blog
            $blog_stmt = $pdo->prepare("SELECT author_id FROM blog_submissions WHERE id = ?");
            $blog_stmt->execute([$blog_id]);
            $blog = $blog_stmt->fetch();
            if ($blog) {
                $pdo->prepare("UPDATE users SET coins = coins + 25 WHERE id = ?")->execute([$blog['author_id']]);
            }

            echo json_encode(["status" => "success", "message" => "Blog published! Author awarded 25 coins."]);
        }
        else {
            $stmt = $pdo->prepare("UPDATE blog_submissions SET status = 'rejected', approved_by = ?, approver_note = ? WHERE id = ? AND status = 'reviewed'");
            $stmt->execute([$approver_id, $approver_note, $blog_id]);
            echo json_encode(["status" => "success", "message" => "Blog rejected"]);
        }
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to process blog"]);
    }
}

elseif ($action === 'get_published_blogs') {
    try {
        $stmt = $pdo->prepare("
            SELECT bs.*, u.name as author_name, u.email as author_email
            FROM blog_submissions bs
            LEFT JOIN users u ON bs.author_id = u.id
            WHERE bs.status = 'published'
            ORDER BY bs.updated_at DESC
        ");
        $stmt->execute();
        $blogs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "blogs" => $blogs]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch published blogs"]);
    }
}

// ========================
// APPLICATION TRACKING
// ========================

elseif ($action === 'submit_application') {
    $user_id = $data->user_id ?? '';
    $app_type = $data->app_type ?? '';
    $app_title = $data->app_title ?? '';
    $description = $data->description ?? '';
    $priority = $data->priority ?? 'medium';

    if (!$user_id || !$app_type || !$app_title) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO application_tracking (user_id, app_type, app_title, description, priority) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $app_type, $app_title, $description, $priority]);
        echo json_encode(["status" => "success", "message" => "Application submitted successfully"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to submit application"]);
    }
}

elseif ($action === 'get_my_applications') {
    $user_id = $data->user_id ?? '';

    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT at.*, u.name as assigned_name
            FROM application_tracking at
            LEFT JOIN users u ON at.assigned_to = u.id
            WHERE at.user_id = ?
            ORDER BY at.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $apps = $stmt->fetchAll();
        echo json_encode(["status" => "success", "applications" => $apps]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch applications"]);
    }
}

elseif ($action === 'get_all_applications') {
    $requester_id = $data->requester_id ?? '';

    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "Requester ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();

    if (!$requester || !in_array($requester['role'], ['admin', 'manager', 'employee'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    try {
        // Fetch general applications
        $stmt = $pdo->prepare("
            SELECT at.*, u.name as user_name, u.email as user_email, a.name as assigned_name
            FROM application_tracking at
            LEFT JOIN users u ON at.user_id = u.id
            LEFT JOIN users a ON at.assigned_to = a.id
            ORDER BY at.created_at DESC
        ");
        $stmt->execute();
        $apps = $stmt->fetchAll();

        // Also fetch instructor applications
        $stmt2 = $pdo->prepare("
            SELECT ia.*, u.name as user_name, u.email as user_email,
                   'instructor_application' as app_type,
                   CONCAT('Instructor Application - ', ia.specialization) as app_title,
                   ia.qualification as description
            FROM instructor_applications ia
            LEFT JOIN users u ON ia.user_id = u.id
            ORDER BY ia.created_at DESC
        ");
        $stmt2->execute();
        $instructorApps = $stmt2->fetchAll();

        $allApps = array_merge($apps, $instructorApps);
        // Sort all by created_at descending
        usort($allApps, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        echo json_encode(["status" => "success", "applications" => $allApps]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch applications"]);
    }
}

elseif ($action === 'update_application_status') {
    $requester_id = $data->requester_id ?? '';
    $app_id = $data->app_id ?? '';
    $new_status = $data->new_status ?? '';
    $notes = $data->notes ?? '';

    if (!$requester_id || !$app_id || !$new_status) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();

    if (!$requester || !in_array($requester['role'], ['admin', 'manager', 'employee'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE application_tracking SET status = ?, notes = ?, assigned_to = ? WHERE id = ?");
        $stmt->execute([$new_status, $notes, $requester_id, $app_id]);
        echo json_encode(["status" => "success", "message" => "Application status updated"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update application"]);
    }
}

// ========================
// MANAGE COINS (Manager / Admin)
// ========================

elseif ($action === 'manage_coins') {
    $requester_id = $data->requester_id ?? '';
    $target_user_id = $data->target_user_id ?? '';
    $amount = intval($data->amount ?? 0);
    $operation = $data->operation ?? 'add';

    if (!$requester_id || !$target_user_id || $amount <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid details"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();

    if (!$requester || $requester['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "Admin access required"]);
        exit;
    }

    try {
        if ($operation === 'add') {
            $pdo->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$amount, $target_user_id]);
        }
        else {
            $pdo->prepare("UPDATE users SET coins = GREATEST(coins - ?, 0) WHERE id = ?")->execute([$amount, $target_user_id]);
        }

        // Log the transaction separately (no beginTransaction to avoid MyISAM issues)
        if ($operation === 'add') {
            $pdo->prepare("INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (NULL, ?, ?)")->execute([$target_user_id, $amount]);
        }
        else {
            $pdo->prepare("INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (?, NULL, ?)")->execute([$target_user_id, $amount]);
        }

        // Return updated user info
        $f = $pdo->prepare("SELECT id, name, email, coins FROM users WHERE id = ?");
        $f->execute([$target_user_id]);
        $updatedUser = $f->fetch();
        echo json_encode(["status" => "success", "message" => "Coins updated! New balance: " . $updatedUser['coins'], "updated_user" => $updatedUser]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to manage coins: " . $e->getMessage()]);
    }
}

elseif ($action === 'get_user') {
    $user_id = $data->user_id ?? '';
    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT id, name, email, first_name, last_name, phone, company, position, role, coins, password_reset, created_at FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $u = $stmt->fetch();
    if ($u) {
        echo json_encode(["status" => "success", "user" => $u]);
    }
    else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
}

elseif ($action === 'get_all_transactions') {
    $requester_id = $data->requester_id ?? '';
    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        exit;
    }
    $s = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $s->execute([$requester_id]);
    $req = $s->fetch();
    if (!$req || $req['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "Admin access required"]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT t.*, s.email as sender_email, s.name as sender_name, r.email as receiver_email, r.name as receiver_name FROM transactions t LEFT JOIN users s ON t.sender_id = s.id LEFT JOIN users r ON t.receiver_id = r.id ORDER BY t.created_at DESC LIMIT 100");
    $stmt->execute();
    echo json_encode(["status" => "success", "transactions" => $stmt->fetchAll()]);
}

// ========================
// ADMIN PASSWORD RESET
// ========================

elseif ($action === 'admin_reset_password') {
    $admin_id = $data->admin_id ?? '';
    $target_user_id = $data->target_user_id ?? '';
    $new_password = $data->new_password ?? '';

    if (!$admin_id || !$target_user_id || !$new_password) {
        echo json_encode(["status" => "error", "message" => "Missing fields"]);
        exit;
    }

    // Verify requester is admin
    $s = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $s->execute([$admin_id]);
    $admin = $s->fetch();

    if (!$admin || $admin['role'] !== 'admin') {
        echo json_encode(["status" => "error", "message" => "Admin access required"]);
        exit;
    }

    try {
        $hash = password_hash($new_password, PASSWORD_DEFAULT);
        // Set password and flag password_reset so user is forced to change on next login
        $pdo->prepare("UPDATE users SET password = ?, password_reset = 1 WHERE id = ?")->execute([$hash, $target_user_id]);
        echo json_encode(["status" => "success", "message" => "Password reset successfully. User will be prompted to change password on next login."]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to reset password"]);
    }
}

elseif ($action === 'clear_password_reset') {
    // Called after user changes their password post-reset
    $id = $data->id ?? '';
    if (!$id) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        exit;
    }
    $pdo->prepare("UPDATE users SET password_reset = 0 WHERE id = ?")->execute([$id]);
    echo json_encode(["status" => "success", "message" => "Reset flag cleared"]);
}

elseif ($action === 'submit_quote') {
    $type = $data->type ?? '';
    $category = $data->category ?? '';
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $phone = $data->phone ?? '';
    $company = $data->company ?? '';
    $message_req = $data->message ?? '';

    if (!$type || !$category || !$name || !$email) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO quotes (type, category, name, email, phone, company, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$type, $category, $name, $email, $phone, $company, $message_req]);
        echo json_encode(["status" => "success", "message" => "Quote submitted successfully"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Submission failed: " . $e->getMessage()]);
    }
}
elseif ($action === 'get_quotes') {
    $user_id = $data->user_id ?? '';
    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$user_id]);
        $user = $check->fetch();
        if (!$user || $user['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }

        $stmt = $pdo->query("SELECT * FROM quotes ORDER BY created_at DESC");
        $quotes = $stmt->fetchAll();
        echo json_encode(["status" => "success", "quotes" => $quotes]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch quotes"]);
    }
}
elseif ($action === 'update_quote') {
    $user_id = $data->user_id ?? '';
    $quote_id = $data->quote_id ?? '';
    $status = $data->status ?? '';

    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$user_id]);
        $user = $check->fetch();
        if (!$user || $user['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE quotes SET status = ? WHERE id = ?");
        $stmt->execute([$status, $quote_id]);
        echo json_encode(["status" => "success", "message" => "Quote updated"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Update failed"]);
    }
}
elseif ($action === 'delete_quote') {
    $user_id = $data->user_id ?? '';
    $quote_id = $data->quote_id ?? '';

    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$user_id]);
        $user = $check->fetch();
        if (!$user || $user['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM quotes WHERE id = ?");
        $stmt->execute([$quote_id]);
        echo json_encode(["status" => "success", "message" => "Quote deleted"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Deletion failed"]);
    }
}
elseif ($action === 'admin_update_user') {
    $admin_id = $data->admin_id ?? '';
    $target_user_id = $data->target_user_id ?? '';
    $name = $data->name ?? '';
    $email = $data->email ?? '';
    $company = $data->company ?? '';
    $position = $data->position ?? '';
    $coins = $data->coins ?? '';

    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$admin_id]);
        $admin = $check->fetch();
        if (!$admin || $admin['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized. Admin access required."]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, company = ?, position = ?, coins = ? WHERE id = ?");
        $stmt->execute([$name, $email, $company, $position, $coins, $target_user_id]);

        echo json_encode(["status" => "success", "message" => "User updated safely"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update user. Email may be taken."]);
    }
}
elseif ($action === 'delete_user') {
    $admin_id = $data->admin_id ?? '';
    $target_user_id = $data->target_user_id ?? '';

    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$admin_id]);
        $admin = $check->fetch();
        if (!$admin || $admin['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized. Admin access required."]);
            exit;
        }

        if ($admin_id == $target_user_id) {
            echo json_encode(["status" => "error", "message" => "Cannot delete your own admin account."]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$target_user_id]);

        echo json_encode(["status" => "success", "message" => "User deleted completely"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to delete user"]);
    }
}
elseif ($action === 'bulk_upload_users') {
    $admin_id = $data->admin_id ?? '';
    $users_data = $data->users ?? []; // Expected an array of objects [ {name, email, password, role} ]

    try {
        $check = $pdo->prepare("SELECT role FROM users WHERE id = ?");
        $check->execute([$admin_id]);
        $admin = $check->fetch();
        if (!$admin || $admin['role'] !== 'admin') {
            echo json_encode(["status" => "error", "message" => "Unauthorized. Admin access required."]);
            exit;
        }

        if (empty($users_data) || !is_array($users_data)) {
            echo json_encode(["status" => "error", "message" => "No valid user data provided."]);
            exit;
        }

        $pdo->beginTransaction();
        $successful = 0;
        $failed = 0;

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, coins) VALUES (?, ?, ?, ?, ?)");

        foreach ($users_data as $u) {
            if (empty($u->email) || empty($u->name)) {
                $failed++;
                continue;
            }

            $password = !empty($u->password) ? $u->password : 'Welcome@123'; // Default password
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $role = !empty($u->role) ? $u->role : 'customer';

            try {
                $stmt->execute([$u->name, $u->email, $hash, $role, 50]);
                $successful++;
            }
            catch (PDOException $subE) {
                // E.g. duplicate email
                $failed++;
            }
        }

        $pdo->commit();

        echo json_encode(["status" => "success", "message" => "Bulk upload complete. Imported: $successful. Failed/Duplicate: $failed."]);
    }
    catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(["status" => "error", "message" => "Bulk upload failed critically: " . $e->getMessage()]);
    }
}
elseif ($action === 'verify_certificate') {
    $certificate_id = $data->certificate_id ?? '';

    if (!$certificate_id) {
        echo json_encode(["status" => "error", "message" => "Certificate ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT u.name, u.email, ce.course_id, c.title, ce.enrolled_at, ce.status 
                                FROM course_enrollments ce 
                                JOIN users u ON ce.user_id = u.id 
                                JOIN courses c ON ce.course_id = c.id 
                                WHERE ce.status = 'completed' AND ce.id = ?");
        $stmt->execute([$certificate_id]);
        $cert = $stmt->fetch();

        if ($cert) {
            echo json_encode(["status" => "success", "certificate" => [
                    "student_name" => $cert['name'],
                    "course_title" => $cert['title'],
                    "issue_date" => date('F j, Y', strtotime($cert['enrolled_at']))
                ]]);
        }
        else {
            echo json_encode(["status" => "error", "message" => "Invalid or unverified certificate ID"]);
        }
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Verification failed"]);
    }
}
elseif ($action === 'enroll_course') {
    $user_id = $data->user_id ?? '';
    $course_id = $data->course_id ?? '';
    if (!$user_id || !$course_id) {
        echo json_encode(["status" => "error", "message" => "User ID and Course ID required"]);
        exit;
    }
    try {
        // check if user already enrolled
        $stmt = $pdo->prepare("SELECT id FROM course_enrollments WHERE user_id = ? AND course_id = ?");
        $stmt->execute([$user_id, $course_id]);
        if ($stmt->fetch()) {
            echo json_encode(["status" => "error", "message" => "Already enrolled"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO course_enrollments (user_id, course_id, status) VALUES (?, ?, 'enrolled')");
        $stmt->execute([$user_id, $course_id]);
        echo json_encode(["status" => "success", "message" => "Enrolled successfully! Enjoy the course."]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Enrollment failed"]);
    }
}
elseif ($action === 'get_my_enrollments') {
    $user_id = $data->user_id ?? '';
    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID required"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("SELECT course_id, status, enrolled_at FROM course_enrollments WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $enrollments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $coursesDetails = [
            1 => ['title' => 'Web Development Fundamentals', 'instructor_name' => 'John Smith', 'category' => 'Technology', 'difficulty' => 'Beginner', 'duration' => '4 weeks', 'progress' => 10],
            2 => ['title' => 'React Advanced Patterns', 'instructor_name' => 'Sarah Johnson', 'category' => 'Technology', 'difficulty' => 'Advanced', 'duration' => '6 weeks', 'progress' => 5],
            3 => ['title' => 'Mobile App Development with Flutter', 'instructor_name' => 'Michael Chen', 'category' => 'Technology', 'difficulty' => 'Intermediate', 'duration' => '8 weeks', 'progress' => 0],
            4 => ['title' => 'Cloud Architecture & DevOps', 'instructor_name' => 'Alex Martinez', 'category' => 'Technology', 'difficulty' => 'Advanced', 'duration' => '6 weeks', 'progress' => 0],
            5 => ['title' => 'UI/UX Design Masterclass', 'instructor_name' => 'Emma Davis', 'category' => 'Design', 'difficulty' => 'Beginner', 'duration' => '5 weeks', 'progress' => 0],
            6 => ['title' => 'Digital Marketing Strategy', 'instructor_name' => 'Lisa Wang', 'category' => 'Marketing', 'difficulty' => 'Intermediate', 'duration' => '4 weeks', 'progress' => 0],
            7 => ['title' => 'Machine Learning for Beginners', 'instructor_name' => 'Dr. James Wilson', 'category' => 'Technology', 'difficulty' => 'Intermediate', 'duration' => '7 weeks', 'progress' => 0],
            8 => ['title' => 'Cybersecurity Fundamentals', 'instructor_name' => 'Tom Harris', 'category' => 'Security', 'difficulty' => 'Beginner', 'duration' => '5 weeks', 'progress' => 0]
        ];

        $results = [];
        foreach ($enrollments as $e) {
            $c_id = $e['course_id'];
            if (isset($coursesDetails[$c_id])) {
                $item = $coursesDetails[$c_id];
                $item['course_id'] = $c_id;
                $item['id'] = $c_id;
                $item['enrolled_at'] = $e['enrolled_at'];
                $item['enroll_status'] = $e['status'];
                $results[] = $item;
            }
        }

        echo json_encode(["status" => "success", "enrollments" => $results]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch enrollments"]);
    }
}
elseif ($action === 'get_routines') {
    echo json_encode(["status" => "success", "routines" => []]);
}
elseif ($action === 'get_my_exams') {
    echo json_encode(["status" => "success", "exams" => []]);
}
elseif ($action === 'get_my_results') {
    echo json_encode(["status" => "success", "results" => []]);
}
elseif ($action === 'get_notices') {
    echo json_encode(["status" => "success", "notices" => []]);
}
elseif ($action === 'create_course') {
    $title = $data->title ?? '';
    $desc = $data->description ?? '';
    $cat = $data->category ?? '';
    $diff = $data->difficulty ?? '';
    $dur = $data->duration ?? '';
    $inst_id = $data->instructor_id ?? null;

    if (!$title) {
        echo json_encode(["status" => "error", "message" => "Title is required"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO courses (title, description, category, difficulty, duration, instructor_id, status) VALUES (?, ?, ?, ?, ?, ?, 'published')");
        $stmt->execute([$title, $desc, $cat, $diff, $dur, $inst_id]);
        echo json_encode(["status" => "success", "message" => "Course created and published successfully"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to create course"]);
    }
}
elseif ($action === 'get_all_courses') {
    try {
        $stmt = $pdo->query("SELECT * FROM courses ORDER BY id DESC");
        $courses = $stmt->fetchAll();
        foreach ($courses as &$c) {
            $c['level'] = $c['difficulty'];
            if (!$c['instructor'])
                $c['instructor'] = 'Instructor';
        }
        echo json_encode(["status" => "success", "courses" => $courses]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch courses"]);
    }
}
elseif ($action === 'get_my_courses_instructor') {
    $inst_id = $data->instructor_id ?? 0;
    try {
        $stmt = $pdo->prepare("SELECT * FROM courses WHERE instructor_id = ? ORDER BY id DESC");
        $stmt->execute([$inst_id]);
        $courses = $stmt->fetchAll();
        foreach ($courses as &$c) {
            $c['level'] = $c['difficulty'];
            if (!$c['instructor'])
                $c['instructor'] = 'Instructor';
        }
        echo json_encode(["status" => "success", "courses" => $courses]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch courses"]);
    }
}
elseif ($action === 'add_news') {
    $title = $data->title ?? '';
    $desc = $data->description ?? '';
    $type = $data->type ?? 'General';
    $iconStr = $data->iconStr ?? 'Bell';

    if (!$title) {
        echo json_encode(["status" => "error", "message" => "Title is required"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO news (title, description, type, iconStr) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $desc, $type, $iconStr]);
        echo json_encode(["status" => "success", "message" => "News posted successfully!"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to post news"]);
    }
}
elseif ($action === 'get_news') {
    try {
        $stmt = $pdo->query("SELECT * FROM news ORDER BY id DESC");
        $news = $stmt->fetchAll();
        foreach ($news as &$n) {
            $n['date'] = date('M j, Y', strtotime($n['date']));
        }
        echo json_encode(["status" => "success", "news" => $news]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch news"]);
    }
}
elseif ($action === 'delete_news') {
    $id = $data->id ?? '';
    try {
        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["status" => "success", "message" => "News deleted successfully!"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to delete news"]);
    }
}

// ========================
// USER ACTIVITY LOGS
// ========================

elseif ($action === 'log_activity') {
    $user_id = $data->user_id ?? '';
    $page = $data->page ?? '';
    $action_type = $data->action_type ?? 'page_view';
    $time_spent = intval($data->time_spent ?? 0);
    $device = $data->device ?? '';
    $browser = $data->browser ?? '';
    $referrer = $data->referrer ?? '';

    if (!$user_id || !$page) {
        echo json_encode(["status" => "error", "message" => "User ID and page required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO user_activity_logs (user_id, page, action_type, time_spent, device, browser, ip_address, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $page, $action_type, $time_spent, $device, $browser, $ip, $referrer]);
        echo json_encode(["status" => "success"]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to log activity"]);
    }
}

elseif ($action === 'get_user_logs') {
    $requester_id = $data->requester_id ?? '';
    $target_user_id = $data->target_user_id ?? '';

    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "Requester ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();
    if (!$requester || !in_array($requester['role'], ['admin', 'manager'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    try {
        if ($target_user_id) {
            $stmt = $pdo->prepare("SELECT * FROM user_activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 200");
            $stmt->execute([$target_user_id]);
        }
        else {
            $stmt = $pdo->query("SELECT * FROM user_activity_logs ORDER BY created_at DESC LIMIT 500");
        }
        $logs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "logs" => $logs]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch logs"]);
    }
}

elseif ($action === 'get_all_activity_logs') {
    $requester_id = $data->requester_id ?? '';

    if (!$requester_id) {
        echo json_encode(["status" => "error", "message" => "Requester ID required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester = $stmt->fetch();
    if (!$requester || !in_array($requester['role'], ['admin', 'manager'])) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }

    try {
        $stmt = $pdo->query("
            SELECT 
                al.user_id,
                u.name as user_name,
                u.email as user_email,
                COUNT(*) as total_visits,
                SUM(al.time_spent) as total_time_spent,
                MAX(al.created_at) as last_activity,
                GROUP_CONCAT(DISTINCT al.page ORDER BY al.created_at DESC SEPARATOR ', ') as pages_visited,
                GROUP_CONCAT(DISTINCT al.device SEPARATOR ', ') as devices,
                GROUP_CONCAT(DISTINCT al.browser SEPARATOR ', ') as browsers
            FROM user_activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            GROUP BY al.user_id
            ORDER BY last_activity DESC
            LIMIT 100
        ");
        $stats = $stmt->fetchAll();

        $feedStmt = $pdo->query("
            SELECT al.*, u.name as user_name, u.email as user_email
            FROM user_activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 50
        ");
        $feed = $feedStmt->fetchAll();

        echo json_encode(["status" => "success", "stats" => $stats, "feed" => $feed]);
    }
    catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to fetch activity logs"]);
    }
}

else {
    echo json_encode(["status" => "error", "message" => "Invalid action"]);
}
?>
