<?php
include 'conexionsi.php';

$data = json_decode(file_get_contents("php://input"), true);

$matricula = $data['matricula'];
$actual    = $data['actual'];
$nueva     = $data['nueva'];

$sql = "SELECT contrasena FROM usuarios WHERE matricula = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $matricula);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["estado" => "error", "mensaje" => "Usuario no encontrado"]);
    exit;
}

$row = $result->fetch_assoc();

if ($actual !== null && !password_verify($actual, $row['contrasena'])) {
    echo json_encode(["estado" => "error", "mensaje" => "La contraseña actual es incorrecta"]);
    exit;
}

$nuevaHash = password_hash($nueva, PASSWORD_DEFAULT);
$sqlUpdate = "UPDATE usuarios SET contrasena = ? WHERE matricula = ?";
$stmt = $conexion->prepare($sqlUpdate);
$stmt->bind_param("ss", $nuevaHash, $matricula);

if ($stmt->execute()) {
    echo json_encode(["estado" => "ok", "mensaje" => "Contraseña actualizada correctamente"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => "No se pudo actualizar la contraseña"]);
}

$conexion->close();
?>
