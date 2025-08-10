<?php
$hostname = 'sql211.infinityfree.com';
$database = 'if0_39665347_sindicatobd';
$username = 'if0_39665347';
$password = 'MgCrBTTz1vfEj';
$port     = 3306;

$conexion = new mysqli($hostname, $username, $password, $database, $port);
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
$conexion->set_charset("utf8"); // Muy importante para evitar problemas con caracteres
?>
