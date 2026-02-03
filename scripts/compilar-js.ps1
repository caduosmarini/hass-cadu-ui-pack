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
    $tgzPath = Join-Path $toolsDir "esbuild.tgz"
    $esbuildVersion = "0.24.2"
    $downloadUrls = @(
        "https://github.com/evanw/esbuild/releases/download/v$esbuildVersion/esbuild-windows-64.zip",
        "https://github.com/evanw/esbuild/releases/download/v$esbuildVersion/esbuild-windows-64.zip?raw=1",
        "https://registry.npmjs.org/esbuild-windows-64/-/esbuild-windows-64-$esbuildVersion.tgz"
    )

    $downloaded = $false
    $downloadPath = $null
    foreach ($url in $downloadUrls) {
        try {
            if ($url.EndsWith(".tgz")) {
                $downloadPath = $tgzPath
            } else {
                $downloadPath = $zipPath
            }
            Invoke-WebRequest -Uri $url -OutFile $downloadPath -ErrorAction Stop
            $downloaded = $true
            break
        } catch {
            Write-Warning "Falha ao baixar: $url"
        }
    }

    if (-not $downloaded) {
        Write-Error "Nao foi possivel baixar o esbuild."
        exit 1
    }
    if ($downloadPath -eq $tgzPath) {
        tar -xf $tgzPath -C $toolsDir
        Remove-Item $tgzPath -Force
        $candidate = Join-Path $toolsDir "package\esbuild.exe"
        if (Test-Path $candidate) {
            Move-Item -Path $candidate -Destination $esbuildPath -Force
            Remove-Item -Path (Join-Path $toolsDir "package") -Recurse -Force
        }
    } else {
        Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
        Remove-Item $zipPath -Force
        $candidate = Join-Path $toolsDir "package\esbuild.exe"
        if (Test-Path $candidate) {
            Move-Item -Path $candidate -Destination $esbuildPath -Force
            Remove-Item -Path (Join-Path $toolsDir "package") -Recurse -Force
        }
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
