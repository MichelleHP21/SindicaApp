<?php
include 'conexionsi.php';

$sql = "SELECT 
            u.id_usuario,
            u.matricula,
            CONCAT(d.Nombre, ' ', d.ApellidoPaterno, ' ', d.ApellidoMaterno) AS nombre_completo,
            d.Telefono,
            d.Correo,
            d.Categoria
        FROM datos d
        INNER JOIN usuarios u ON u.id_usuario = d.id_usuario
        WHERE u.rol = 'trabajador' AND u.activo = '1'";


$resultado = $conexion->query($sql);

$trabajadores = [];

while ($fila = $resultado->fetch_assoc()) {
    $trabajadores[] = $fila;
}

echo json_encode($trabajadores);
