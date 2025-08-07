<?php
include 'conexionsi.php';

$id_usuario = $_GET['id_usuario'] ?? '';

if (!$id_usuario) {
    echo json_encode(["existe" => false, "mensaje" => "ID de usuario no proporcionado"]);
    exit;
}

$sql = "SELECT Nombre, ApellidoPaterno, ApellidoMaterno, OOAD, NoPlaza, Categoria, Contratacion, Turno, HoraInicio, HoraFin, Correo, DiaDescanso, Direccion, Telefono, curp, rfc, fecha_nac
        FROM datos WHERE id_usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

if (!$stmt) {
    echo json_encode(["existe" => false, "mensaje" => "Error en la consulta"]);
    exit;
}

if ($result->num_rows > 0) {
    $datos = $result->fetch_assoc();
    echo json_encode(array_merge(["existe" => true], $datos));
} else {
    echo json_encode(["existe" => false]);
}

$stmt->close();
$conexion->close();
?>
