---
title: Deploying Node Server to Hostinger
description: Detailed setup for Next.js and frontend integration
---
Here forms the complete guide for pushing your NETMAXIN codebase to Hostinger without breaking external endpoints.

# Hostinger Deployment Guide (NETMAXIN)

## 0. Build frontend directly
Execute locally inside your terminal:
```bash
npm run build 
```

## 1. Map Backend MySQL Endpoint on Hostinger Node Server 
In your `php-backend/auth.php` inside the DB credentials:
```php
<?php
// Hostinger Database Configuration
$host = 'localhost';
$db = 'u903487771_netmaxin'; // Ensure this matches Hostinger DB
$user = 'u903487771_netmaxin'; 
$pass = 'Niharika@6532';
//...
```
1. Open Hostinger **File Manager**.
2. Head into `/domains/netmaxin.com/public_html`.
3. Directly upload `auth.php` to this main folder.

## 2. Setting Up Next.js Node Environment
Since Next.js executes server-functions (like Image optimizations and metadata generation properly), use the Node.js server module available in Hostinger over Static File placement.
1. Open **Hostinger Panel** -> **Advanced Setup** -> **Node.js**.
2. Click **Create Application**. Start up file is `npm start`. Root is `/`.
3. Zip everything in the project root directory **except**:
   - `node_modules`
   - `.git`
4. Upload your ZIP using File Manager to `public_html`.
5. Extract it.

## 3. Install & Start Hostinger App Container
1. Once Extracted, inside the Node.js Hostinger setting Panel, click the **`NPM Install`** button to prepare dependencies online.
2. Click **`Start / Restart App`**. 
3. Now access `https://netmaxin.com` to confirm initialization. 
Wait up to 60 seconds after running Node startup tasks to refresh!
