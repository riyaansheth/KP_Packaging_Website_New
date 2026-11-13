<?php
// Website inquiry handler for Hostinger. Saves every inquiry to inquiries/inquiries.csv
// (blocked from the web by .htaccess) and emails it to the KP Packaging team.
header('Content-Type: application/json');

$TO = 'prem@kppackaging.com, sales@kppackaging.com';
$FROM = 'KP Packaging Website <website@kppackaging.com>';
$FIELDS = ['form-name' => 'Form', 'name' => 'Name', 'company' => 'Company', 'email' => 'Email', 'phone' => 'Phone',
  'product' => 'Product of interest', 'coating' => 'Coating', 'country' => 'Country', 'message' => 'Message'];

function reply($code, $body) { http_response_code($code); echo json_encode($body); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['error' => 'Method not allowed']);
if (trim($_POST['bot-field'] ?? '') !== '') reply(200, ['ok' => true]); // honeypot: pretend success

$d = [];
foreach ($FIELDS as $k => $_) $d[$k] = mb_substr(trim((string)($_POST[$k] ?? '')), 0, $k === 'message' ? 5000 : 200);
foreach (['name', 'email', 'phone', 'form-name', 'company', 'product', 'coating', 'country'] as $k)
  $d[$k] = str_replace(["\r", "\n"], ' ', $d[$k]); // single-line fields; blocks header injection
if ($d['name'] === '' || $d['phone'] === '' || !filter_var($d['email'], FILTER_VALIDATE_EMAIL))
  reply(400, ['error' => 'Name, phone and a valid email are required']);

// Save first, so an inquiry is never lost even if email delivery fails
$dir = __DIR__ . '/inquiries';
if (!is_dir($dir)) mkdir($dir, 0700);
if (!file_exists("$dir/.htaccess")) file_put_contents("$dir/.htaccess", "Require all denied\n");
$fh = fopen("$dir/inquiries.csv", 'a');
// Prefix cells Excel would treat as formulas
$row = array_map(fn($v) => preg_match('/^[=+\-@]/', $v) ? "'$v" : $v, array_values($d));
$saved = $fh && fputcsv($fh, array_merge([date('c'), $_SERVER['REMOTE_ADDR'] ?? ''], $row)) !== false;
if ($fh) fclose($fh);

$product = $d['product'] !== '' ? $d['product'] : 'General inquiry';
$subject = 'New ' . ($d['form-name'] ?: 'inquiry') . " from {$d['name']} - $product";
$body = '';
foreach ($FIELDS as $k => $label) if ($d[$k] !== '') $body .= "$label: {$d[$k]}\n";
$body .= "\nReply to this email to contact {$d['name']}.\n";
$headers = "From: $FROM\r\nReply-To: {$d['email']}\r\nContent-Type: text/plain; charset=UTF-8";
$mailed = mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-fwebsite@kppackaging.com');

if (!$saved && !$mailed) reply(500, ['error' => 'Could not save or send the inquiry']);
reply(200, ['ok' => true]);
