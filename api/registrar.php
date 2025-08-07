<?php
include 'conexionsi.php';

// Obtener datos del formulario
$matricula = $_POST['matricula'];
$rol       = $_POST['rol'];

// Validar si la matrícula ya existe
$sql_check = "SELECT * FROM usuarios WHERE matricula = '$matricula'";
$result_check = $conexion->query($sql_check);

if ($result_check->num_rows > 0) {
    echo json_encode([
        "estado" => "error",
        "mensaje" => "La matrícula ya está registrada."
    ]);
} else {
    // Usar la matrícula como contraseña por defecto y encriptarla
    $contrasena_default = $matricula;
    $contrasena_hash = password_hash($contrasena_default, PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $sql = "INSERT INTO usuarios (matricula, contrasena, rol, activo)
            VALUES ('$matricula', '$contrasena_hash', '$rol', 1)";

    if ($conexion->query($sql) === TRUE) {
        // Obtener el ID del usuario recién insertado
        $id_usuario = $conexion->insert_id;

        // Insertar en la tabla 'datos' con el id_usuario recién creado
        $sql_datos = "INSERT INTO datos (id_usuario) VALUES ('$id_usuario')";
        if ($conexion->query($sql_datos) === TRUE) {
            echo json_encode([
                "estado" => "ok",
                "mensaje" => "Trabajador dado de alta correctamente"
            ]);
        } else {
            echo json_encode([
                "estado" => "error",
                "mensaje" => "Usuario creado pero ocurrió un error al insertar en la tabla datos: " . $conexion->error
            ]);
        }
    } else {
        echo json_encode([
            "estado" => "error",
            "mensaje" => "Error al registrar: " . $conexion->error
        ]);
    }
}

$conexion->close();
?>
