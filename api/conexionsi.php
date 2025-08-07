<?php
$hostname = 'localhost';
$database = 'sindicatobd';
$username = 'root';
$password = '';

$conexion = new mysqli($hostname, $username, $password, $database);
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
$conexion->set_charset("utf8"); // Muy importante para evitar problemas con caracteres
?>
