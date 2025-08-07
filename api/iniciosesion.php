<?php
header('Content-Type: application/json');
include 'conexionsi.php';

// Validar si se enviaron los datos necesarios
if (!isset($_POST['matricula']) || !isset($_POST['contrasena'])) {
    echo json_encode([
        "estado" => "error",
        "mensaje" => "Faltan datos: Matricula o Contraseña"
    ]);
    exit;
}

$matricula = $_POST['matricula'];
$contrasena = $_POST['contrasena'];

// Consulta JOIN para obtener datos de usuario Y solo nombre y apellidos
$stmt = $conexion->prepare("
    SELECT 
        u.id_usuario, 
        u.rol, 
        u.matricula,
        u.contrasena,
        d.Nombre, 
        d.ApellidoPaterno, 
        d.ApellidoMaterno
    FROM usuarios u 
    LEFT JOIN datos d ON u.id_usuario = d.id_usuario 
    WHERE u.matricula = ? AND u.activo = 1
");

$stmt->bind_param("s", $matricula);
$stmt->execute();
$resultado = $stmt->get_result();

// Verificar si el usuario existe
if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
    $hash_guardado = $usuario['contrasena'];
    
    // Verificar contraseña
    if (password_verify($contrasena, $hash_guardado)) {
        // Preparar respuesta con datos básicos
        $respuesta = [
            "estado" => "ok",
            "mensaje" => "Inicio de sesión exitoso",
            "datos" => [
                "id_usuario" => $usuario['id_usuario'],
                "Rol" => $usuario['rol'],
                "matricula" => $usuario['matricula'],
                "Nombre" => $usuario['Nombre'] ?? '',
                "ApellidoPaterno" => $usuario['ApellidoPaterno'] ?? '',
                "ApellidoMaterno" => $usuario['ApellidoMaterno'] ?? ''
            ]
        ];
        
        echo json_encode($respuesta);
    } else {
        echo json_encode([
            "estado" => "error",
            "mensaje" => "Contraseña incorrecta"
        ]);
    }
} else {
    echo json_encode([
        "estado" => "error", 
        "mensaje" => "Usuario no encontrado o inactivo"
    ]);
}

$stmt->close();
$conexion->close();
?>