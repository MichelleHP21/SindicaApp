<?php
header('Content-Type: application/json');
require_once '../api/conexionsi.php';

if (!isset($conexion)) {
    echo json_encode(['mensaje' => 'Error de conexión']);
    http_response_code(500);
    exit;
}

if (!isset($_GET['id']) && !isset($_POST['id'])) {
    echo json_encode(['mensaje' => 'ID de usuario no proporcionado']);
    http_response_code(400);
    exit;
}

$id_usuario = $_GET['id'] ?? $_POST['id']; // acepta ambos métodos

$sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
$stmt = $conexion->prepare($sql); 

if (!$stmt) {
    echo json_encode(['mensaje' => 'Error al preparar la consulta']);
    http_response_code(500);
    exit;
}

$stmt->bind_param("i", $id_usuario);

if ($stmt->execute()) {
    echo json_encode(['mensaje' => 'Usuario dado de baja exitosamente']);
} else {
    http_response_code(500);
    echo json_encode(['mensaje' => 'Error al dar de baja al usuario']);
}

$stmt->close();
$conexion->close();
?>