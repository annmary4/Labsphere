$port = 3000
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$dataDir = Join-Path $baseDir "data"
$dbFile = Join-Path $dataDir "db.json"

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir | Out-Null
}

function Get-LanIP {
    try {
        $ip = (Get-NetIPAddress -AddressFamily IPv4 -Type Unicast | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' } | Select-Object -First 1).IPAddress
        if ($ip) { return $ip }
    } catch {}
    return "127.0.0.1"
}

$serverIp = Get-LanIP
$listener = New-Object System.Net.HttpListener

try {
    $listener.Prefixes.Add("http://+:$port/")
    $listener.Start()
} catch {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://*:$port/")
        $listener.Start()
    } catch {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$port/")
        $listener.Start()
    }
}

Write-Host "============================================================"
Write-Host "[SERVER] LabSphere Central Master Server Running!"
Write-Host "[SERVER] Local Access:   http://localhost:$port"
Write-Host "[SERVER] Mobile Access:  http://${serverIp}:$port"
Write-Host "============================================================"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $cleanPath = $request.Url.AbsolutePath.TrimEnd('/')

        if ($cleanPath -eq "/api/network-ip") {
            $payload = @{
                ip = $serverIp
                port = $port
                serverUrl = "http://${serverIp}:$port"
            } | ConvertTo-Json
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if ($cleanPath -eq "/api/db") {
            if ($request.HttpMethod -eq "GET") {
                $response.ContentType = "application/json; charset=utf-8"
                if (Test-Path $dbFile) {
                    $bytes = [System.IO.File]::ReadAllBytes($dbFile)
                } else {
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes("{}")
                }
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd()
                $reader.Close()
                [System.IO.File]::WriteAllText($dbFile, $body, [System.Text.Encoding]::UTF8)
                
                $payload = @{ status = "success"; message = "Master DB updated on server disk" } | ConvertTo-Json
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($payload)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.Close()
                continue
            }
        }

        # Static files
        $urlPath = $request.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }
        $filePath = Join-Path $baseDir $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            $response.Close()
        }
    } catch {
        # Catch connection drop or loop break gracefully
    }
}
