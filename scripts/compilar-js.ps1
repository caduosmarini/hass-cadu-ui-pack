#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Ensure-Esbuild {
    $toolsDir = Join-Path $PSScriptRoot "..\tools"
    $esbuildPath = Join-Path $toolsDir "esbuild.exe"
    if (Test-Path $esbuildPath) {
        return $esbuildPath
    }

    Write-Host "Baixando esbuild..."
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
    $zipPath = Join-Path $toolsDir "esbuild.zip"
    $downloadUrl = "https://github.com/evanw/esbuild/releases/latest/download/esbuild-windows-64.zip"

    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    Remove-Item $zipPath -Force

    $candidate = Join-Path $toolsDir "package\esbuild.exe"
    if (Test-Path $candidate) {
        Move-Item -Path $candidate -Destination $esbuildPath -Force
        Remove-Item -Path (Join-Path $toolsDir "package") -Recurse -Force
    }

    if (-not (Test-Path $esbuildPath)) {
        Write-Error "Nao foi possivel preparar o esbuild."
        exit 1
    }
    return $esbuildPath
}

$rootDir = Join-Path $PSScriptRoot ".."
$entry = Join-Path $rootDir "src\hass-cadu-ui-pack.entry.js"
$output = Join-Path $rootDir "hass-cadu-ui-pack.js"

Write-Host "Compilando bundle..."
$esbuild = Ensure-Esbuild
& $esbuild $entry `
    --bundle `
    --minify `
    --format=esm `
    --target=es2018 `
    --outfile=$output

Write-Host "Bundle gerado em $output"
