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
$apellidoMaterno = $_GET['apellidoMaterno'] ?? 'Apellido Materno de ejemplo';
$matricula = $_GET['matricula'] ?? 'MATRICULA0000';
$adscripcion = $_GET['adscripcion'] ?? 'Depto de Sistemas';
$categoria = $_GET ['categoria'] ?? 'Categoria ejemplo';
$funcionesExtramuros = $_GET['funcionesExtramuros'] ?? 'Funciones Extramuros de ejemplo';
$periodoTraslado = $_GET['periodoTraslado'] ?? '01/01/2024 - 31/12/2024';
$importeNumero = $_GET['importeNumero'] ?? '1234.56';
$importeLetras = $_GET['importeLetras'] ?? 'Mil doscientos treinta y cuatro pesos con 56/100 M.N.';
$lapsoDelDia = $_GET['lapsoDelDia'] ?? '1';
$lapsoDeMes = $_GET['lapsoDeMes'] ?? '1';
$lapsoAlDia = $_GET['lapsoAlDia'] ?? '31';
$lapsoDeMes2 = $_GET['lapsoDeMes2'] ?? '12';
$lapsoDeAnio = $_GET['lapsoDeAnio'] ?? '2024';
$observaciones = $_GET ['observaciones'] ?? 'observaciones';


// Escribir sobre el PDF en coordenadas X, Y
$pdf->SetXY(150, 73);
$pdf->Write(0, utf8_decode("$nombre"));

$pdf->SetXY(30, 71);
$pdf->Write(0, utf8_decode("$apellidoPaterno"));

$pdf->SetXY(100, 72);
$pdf->Write(0, utf8_decode("$apellidoMaterno"));

$pdf->SetXY(40, 76);
$pdf->Write(0, utf8_decode("$matricula"));

$pdf->SetXY(40, 82);
$pdf->Write(0, utf8_decode("$adscripcion"));

$pdf->SetXY(100, 77);
$pdf->Write(0, utf8_decode("$categoria"));

$pdf->SetXY(20, 92);
$pdf->Write(0, utf8_decode("$funcionesExtramuros"));

$pdf->SetXY(130, 95);
$pdf->Write(0, utf8_decode("$periodoTraslado"));

$pdf->SetXY(32, 128);
$pdf->Write(0, utf8_decode("$importeNumero"));

$pdf->SetXY(62, 128);
$pdf->Write(0, utf8_decode("$importeLetras"));

$pdf->SetXY(32, 138);
$pdf->Write(0, utf8_decode("$lapsoDelDia"));

$pdf->SetXY(62, 138);
$pdf->Write(0, utf8_decode("$lapsoDeMes"));

$pdf->SetXY(92, 138);
$pdf->Write(0, utf8_decode("$lapsoAlDia"));

$pdf->SetXY(122, 138);
$pdf->Write(0, utf8_decode("$lapsoDeMes2"));

$pdf->SetXY(152, 138);
$pdf->Write(0, utf8_decode("$lapsoDeAnio"));

$pdf->SetXY(40,145);
$pdf->Write(0, utf8_decode("$observaciones"));
// Mostrar el PDF en el navegador
$pdf->Output('I', 'Concepto_026.pdf');
