<?php
include 'conexionsi.php';

$data = json_decode(file_get_contents("php://input"), true);

$id_usuario = $data['id_usuario'] ?? '';

if (!$id_usuario) {
    echo json_encode(["success" => false, "mensaje" => "ID de usuario no proporcionado"]);
    exit;
}

// Campos personales
$campos = [
    'Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'OOAD', 'NoPlaza', 'Categoria',
    'Contratacion', 'Turno', 'HoraInicio', 'HoraFin', 'Correo', 'DiaDescanso',
    'Direccion', 'Telefono', 'curp', 'rfc', 'fecha_nac'
];

$valores = [];
foreach ($campos as $campo) {
    $valores[$campo] = $data[$campo] ?? null;
}

// Verificar si ya existen datos para ese usuario
$check = $conexion->prepare("SELECT id_usuario FROM datos WHERE id_usuario = ?");
$check->bind_param("i", $id_usuario);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    // Ya existe, actualizar
    $sql = "UPDATE datos SET 
        Nombre=?, ApellidoPaterno=?, ApellidoMaterno=?, OOAD=?, NoPlaza=?, Categoria=?,
        Contratacion=?, Turno=?, HoraInicio=?, HoraFin=?, Correo=?, DiaDescanso=?,
        Direccion=?, Telefono=?, curp=?, rfc=?, fecha_nac=?
        WHERE id_usuario=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        "ssssssssssssssssss",
        $valores['Nombre'], $valores['ApellidoPaterno'], $valores['ApellidoMaterno'], $valores['OOAD'], $valores['NoPlaza'], $valores['Categoria'],
        $valores['Contratacion'], $valores['Turno'], $valores['HoraInicio'], $valores['HoraFin'], $valores['Correo'], $valores['DiaDescanso'],
        $valores['Direccion'], $valores['Telefono'], $valores['curp'], $valores['rfc'], $valores['fecha_nac'], $id_usuario
    );
} else {
    // Insertar nuevo
    $sql = "INSERT INTO datos (Nombre, ApellidoPaterno, ApellidoMaterno, OOAD, NoPlaza, Categoria,
        Contratacion, Turno, HoraInicio, HoraFin, Correo, DiaDescanso,
        Direccion, Telefono, curp, rfc, fecha_nac, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        "ssssssssssssssssss",
        $valores['Nombre'], $valores['ApellidoPaterno'], $valores['ApellidoMaterno'], $valores['OOAD'], $valores['NoPlaza'], $valores['Categoria'],
        $valores['Contratacion'], $valores['Turno'], $valores['HoraInicio'], $valores['HoraFin'], $valores['Correo'], $valores['DiaDescanso'],
        $valores['Direccion'], $valores['Telefono'], $valores['curp'], $valores['rfc'], $valores['fecha_nac'], $id_usuario
    );
}

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "mensaje" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
