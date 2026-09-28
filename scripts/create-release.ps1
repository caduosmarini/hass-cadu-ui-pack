#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

function Require-Command {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        Write-Error "Comando '$Name' nao encontrado no PATH."
        exit 1
    }
}

Require-Command git
Require-Command gh

try {
    $null = git rev-parse --is-inside-work-tree | Out-Null
} catch {
    Write-Error "Execute este script dentro de um repositorio git."
    exit 1
}

try {
    $originUrl = git remote get-url origin
} catch {
    Write-Error "Remote 'origin' nao encontrado."
    exit 1
}

$expectedRepo = "caduosmarini/hass-cadu-ui-pack"
if ($originUrl -notmatch [regex]::Escape($expectedRepo)) {
    Write-Warning "Origin atual nao parece ser '$expectedRepo'. URL: $originUrl"
}

$lastTag = (git tag --sort=-creatordate) | Select-Object -First 1
if ([string]::IsNullOrWhiteSpace($lastTag)) {
    $lastTag = "<nenhuma>"
}

Write-Host "Ultima tag: $lastTag"
$suggestedTag = $null
if ($lastTag -match '^(v?)(\d+(?:\.\d+)*\.)(\d+)$') {
    $nextNumber = [System.Numerics.BigInteger]::Parse($Matches[3]) + [System.Numerics.BigInteger]::One
    $suggestedTag = "$($Matches[1])$($Matches[2])$nextNumber"
}

$prompt = "Nome da nova tag/release"
if ($suggestedTag) {
    $prompt += " [$suggestedTag]"
}
$tagName = Read-Host $prompt

if ([string]::IsNullOrWhiteSpace($tagName)) {
    if (-not $suggestedTag) {
        Write-Error "A ultima tag nao tem versao numerica. Informe o nome da nova tag."
        exit 1
    }
    $tagName = $suggestedTag
    Write-Host "Usando tag sugerida: $tagName"
}

$existingTag = git tag --list $tagName
if (-not [string]::IsNullOrWhiteSpace($existingTag)) {
    Write-Error "Tag '$tagName' ja existe."
    exit 1
}

& (Join-Path $PSScriptRoot "compilar-js.ps1")

git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Error "Sem alteracoes para commit apos o build."
    exit 1
}

git commit -m "Release $tagName"
git push origin HEAD
git tag -a $tagName -m $tagName
git push origin $tagName
gh release create $tagName --title $tagName --generate-notes

Write-Host "Release criada: $tagName"
