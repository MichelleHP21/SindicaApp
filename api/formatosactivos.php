<?php
header('Content-Type: application/json');
include 'conexionsi.php';

// Fecha actual
$hoy = date('Y-m-d');

$sql = "SELECT * FROM formatos WHERE '$hoy' BETWEEN fecha_inicio AND fecha_fin";
$result = $conexion->query($sql);

$formatos = []; // arreglo para guardar resultados

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $formatos[] = $row;
    }
}

// En cualquier caso devolver JSON
echo json_encode($formatos);
exit;
