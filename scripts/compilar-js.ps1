#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Ensure-Esbuild {
    $rootDir = Join-Path $PSScriptRoot ".."
    $esbuildPath = Join-Path $rootDir "node_modules\.bin\esbuild.cmd"
    if (Test-Path $esbuildPath) {
        return $esbuildPath
    }

    $npx = Get-Command npx -ErrorAction SilentlyContinue
    if ($npx) {
        return "npx"
    }

    Write-Error "Esbuild nao encontrado. Rode: npm install --save-exact --save-dev esbuild"
    exit 1
}

$rootDir = Join-Path $PSScriptRoot ".."
$entry = Join-Path $rootDir "src\hass-cadu-ui-pack.entry.js"
$output = Join-Path $rootDir "hass-cadu-ui-pack.js"

Write-Host "Compilando bundle..."
$esbuild = Ensure-Esbuild
if ($esbuild -eq "npx") {
    npx esbuild $entry `
        --bundle `
        --minify `
        --format=esm `
        --target=es2018 `
        --outfile=$output
} else {
    & $esbuild $entry `
        --bundle `
        --minify `
        --format=esm `
        --target=es2018 `
        --outfile=$output
}

Write-Host "Bundle gerado em $output"
