<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Debugging: Tampilkan data yang diterima
    if (!$data) {
        echo json_encode(['status' => 'error', 'message' => 'No data received']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO items (name, quantity, price, description) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['quantity'], $data['price'], $data['description']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} elseif (isset($_GET['action']) && $_GET['action'] === 'get') {
    try {
        $stmt = $pdo->query("SELECT * FROM items ORDER BY created_at DESC");
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($items);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}