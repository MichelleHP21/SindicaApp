<?php
header("Content-Type: application/json");
include 'conexionsi.php';

$query = "SELECT 
            id_formato, 
            nombre, 
            DATE_FORMAT(fecha_inicio, '%Y-%m-%d') as fecha_inicio, 
            DATE_FORMAT(fecha_fin, '%Y-%m-%d') as fecha_fin 
          FROM formatos";
$result = $conexion->query($query);

$formatos = [];
while ($row = $result->fetch_assoc()) {
    $formatos[] = $row;
}

echo json_encode($formatos);

$conexion->close();
?>