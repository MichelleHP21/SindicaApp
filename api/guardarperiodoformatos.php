<?php
// periodoformatos.php
header("Content-Type: application/json");
include 'conexionsi.php';

$input = json_decode(file_get_contents('php://input'), true);

$nombre_formato = $input['nombre_formato'] ?? '';
$fecha_inicio = $input['fecha_inicio'] ?? null;
$fecha_fin = $input['fecha_fin'] ?? null;

if (empty($nombre_formato)) {
    echo json_encode(["success" => false, "message" => "Nombre de formato requerido"]);
    exit;
}

try {
    // Verificar si el formato ya existe
    $stmt = $conexion->prepare("SELECT id_formato FROM formatos WHERE nombre = ?");
    $stmt->bind_param("s", $nombre_formato);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Actualizar existente
        $row = $result->fetch_assoc();
        $stmt = $conexion->prepare("UPDATE formatos SET fecha_inicio = ?, fecha_fin = ? WHERE id_formato = ?");
        $stmt->bind_param("ssi", $fecha_inicio, $fecha_fin, $row['id_formato']);
    } else {
        // Crear nuevo
        $stmt = $conexion->prepare("INSERT INTO formatos (nombre, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, 1)");
        $stmt->bind_param("sss", $nombre_formato, $fecha_inicio, $fecha_fin);
    }
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Periodo guardado correctamente"]);
    } else {
        throw new Exception("Error al guardar en base de datos");
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$stmt->close();
$conexion->close();
?>