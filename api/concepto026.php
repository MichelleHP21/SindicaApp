<?php
require_once '../vendor/autoload.php';

use setasign\Fpdi\Fpdi;

$pdf = new FPDI();

// Cargar PDF base (plantilla)
$pdf->AddPage();
$pdf->setSourceFile('../pdf/CONCEPTO_026.pdf');
$templateId = $pdf->importPage(1);
$pdf->useTemplate($templateId);

// Configurar fuente y tamaño
$pdf->SetFont('Arial', '', 10);
$pdf->SetTextColor(0, 0, 0); // Color negro

// Puedes recibir datos desde el frontend con GET o POST
$nombre = $_GET['nombres'] ?? 'Nombre de ejemplo';
$apellidoPaterno = $_GET['apellidoPaterno'] ?? 'Apellido Paterno de ejemplo';
$matricula = $_GET['matricula'] ?? 'MATRICULA0000';
$adscripcion = $_GET['adscripcion'] ?? 'Depto de Sistemas';

// Escribir sobre el PDF en coordenadas X, Y
$pdf->SetXY(150, 73);
$pdf->Write(0, utf8_decode("$nombre"));

$pdf->SetXY(30, 71);
$pdf->Write(0, utf8_decode("$apellidoPaterno"));

$pdf->SetXY(40, 76);
$pdf->Write(0, utf8_decode("$matricula"));

$pdf->SetXY(40, 82);
$pdf->Write(0, utf8_decode("$adscripcion"));

// Mostrar el PDF en el navegador
$pdf->Output('I', 'Concepto_026.pdf');
