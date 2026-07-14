Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$Path
    )
    
    # Create bitmap and graphics
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Enable high quality rendering
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $color1 = [System.Drawing.ColorTranslator]::FromHtml("#6366f1")
    $color2 = [System.Drawing.ColorTranslator]::FromHtml("#a855f7")
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $color1, $color2, 45.0)
    
    # Fill rounded rectangle background
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $radius = $Size * 0.22
    if ($radius -lt 1) { $radius = 1 }
    $arcRect = New-Object System.Drawing.RectangleF(0, 0, $radius*2, $radius*2)
    
    # Top-Left Arc
    $path.AddArc($arcRect, 180, 90)
    # Top-Right Arc
    $arcRect.X = $Size - ($radius*2) - 1
    $path.AddArc($arcRect, 270, 90)
    # Bottom-Right Arc
    $arcRect.Y = $Size - ($radius*2) - 1
    $path.AddArc($arcRect, 0, 90)
    # Bottom-Left Arc
    $arcRect.X = 0
    $path.AddArc($arcRect, 90, 90)
    
    $path.CloseFigure()
    
    $g.FillPath($brush, $path)
    
    # Draw an envelope inside
    $envWidth = $Size * 0.55
    $envHeight = $Size * 0.38
    $envX = ($Size - $envWidth) / 2
    $envY = ($Size - $envHeight) / 2 + ($Size * 0.05) # Shift down slightly for sparkle
    
    $penWidth = $Size * 0.05
    if ($penWidth -lt 1) { $penWidth = 1 }
    $envPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $penWidth)
    $envPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    
    # Draw envelope border
    $g.DrawRectangle($envPen, $envX, $envY, $envWidth, $envHeight)
    
    # Draw envelope flap (triangle/V-shape)
    $p1 = New-Object System.Drawing.PointF($envX, $envY)
    $p2 = New-Object System.Drawing.PointF(($envX + $envWidth/2), ($envY + $envHeight * 0.55))
    $p3 = New-Object System.Drawing.PointF(($envX + $envWidth), $envY)
    $g.DrawLines($envPen, @($p1, $p2, $p3))
    
    # Draw Sparkle (AI magic star) at top-right
    $spX = $Size * 0.72
    $spY = $Size * 0.28
    $spSize = $Size * 0.22
    if ($spSize -lt 3) { $spSize = 3 }
    
    $spColor = [System.Drawing.ColorTranslator]::FromHtml("#fde047") # light yellow
    $spBrush = New-Object System.Drawing.SolidBrush($spColor)
    
    $spPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cx = $spX
    $cy = $spY
    $rOut = $spSize / 2
    $rIn = $spSize / 6
    if ($rIn -lt 0.5) { $rIn = 0.5 }
    
    $pts = @(
        (New-Object System.Drawing.PointF($cx, $cy - $rOut)), # Top
        (New-Object System.Drawing.PointF($cx + $rIn, $cy - $rIn)),
        (New-Object System.Drawing.PointF($cx + $rOut, $cy)), # Right
        (New-Object System.Drawing.PointF($cx + $rIn, $cy + $rIn)),
        (New-Object System.Drawing.PointF($cx, $cy + $rOut)), # Bottom
        (New-Object System.Drawing.PointF($cx - $rIn, $cy + $rIn)),
        (New-Object System.Drawing.PointF($cx - $rOut, $cy)), # Left
        (New-Object System.Drawing.PointF($cx - $rIn, $cy - $rIn))
    )
    $spPath.AddPolygon($pts)
    $g.FillPath($spBrush, $spPath)
    
    # Clean up
    $envPen.Dispose()
    $spBrush.Dispose()
    $brush.Dispose()
    $g.Dispose()
    
    # Save image
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

# Create icons folder if not exists
$iconsDir = "x:\open source\gemini\MailGenie\emailwriterextension\icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Force -Path $iconsDir
}

# Generate all sizes
Create-Icon 16 "$iconsDir\icon16.png"
Create-Icon 32 "$iconsDir\icon32.png"
Create-Icon 48 "$iconsDir\icon48.png"
Create-Icon 128 "$iconsDir\icon128.png"

Write-Host "Icons generated successfully!"
