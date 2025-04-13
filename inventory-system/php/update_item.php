<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("UPDATE items SET name = ?, quantity = ?, price = ?, description = ? WHERE id = ?");
    $stmt->execute([$data['name'], $data['quantity'], $data['price'], $data['description'], $data['id']]);
    
    echo json_encode(['status' => 'success']);
}