<?php
header('Content-Type: application/json');
include 'conexionsi.php';

// Leer datos JSON recibidos
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['matricula'])) {
    echo json_encode(['success' => false, 'message' => 'Matrícula es requerida.']);
    exit;
}

$matricula = $conexion->real_escape_string($data['matricula']);

// Buscar usuario con esa matrícula
$sql = "SELECT * FROM usuarios WHERE matricula = '$matricula'";
$result = $conexion->query($sql);

if ($result && $result->num_rows > 0) {
    // Opcional: Obtén datos usuario si quieres
    
    // Actualizar contraseña a la matrícula (con hash para seguridad)
    $passwordHash = password_hash($matricula, PASSWORD_DEFAULT);

    $sqlUpdate = "UPDATE usuarios SET contrasena = '$passwordHash' WHERE matricula = '$matricula'";

    if ($conexion->query($sqlUpdate) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Matrícula no encontrada.']);
}
