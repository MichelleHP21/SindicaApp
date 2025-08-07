<?php
include 'conexionsi.php';

$id_usuario = $_GET['id_usuario'] ?? '';

if (!$id_usuario) {
    echo json_encode(["existe" => false, "mensaje" => "ID no proporcionado"]);
    exit;
}

// JOIN para traer datos de la tabla 'datos' y también 'usuarios'
$sql = "SELECT 
            u.matricula,
            d.Nombre, d.ApellidoPaterno, d.ApellidoMaterno, d.OOAD, d.NoPlaza, 
            d.Categoria, d.Contratacion, d.Turno, d.HoraInicio, d.HoraFin, 
            d.Correo, d.DiaDescanso, d.Direccion, d.Telefono, d.curp, 
            d.rfc, d.fecha_nac
        FROM datos d
        INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
        WHERE d.id_usuario = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $datos = $result->fetch_assoc();
    echo json_encode(array_merge(["existe" => true], $datos));
} else {
    echo json_encode(["existe" => false]);
}

$stmt->close();
$conexion->close();
?>
