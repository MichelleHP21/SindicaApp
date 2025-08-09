<?php
// archivo: obtener_formato.php
header("Content-Type: application/json");
include 'conexionsi.php';

$id_formato = $_GET['id_formato'] ?? 0;

$stmt = $conexion->prepare("SELECT id_formato, nombre, fecha_inicio, fecha_fin, activo FROM formatos WHERE id_formato = ?");
$stmt->bind_param("i", $id_formato);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "Formato no encontrado"]);
}

$stmt->close();
$conexion->close();
?>