<#
.SYNOPSIS
  see-it: picture a desk window (Toast card / pinned / wallpaper window, the app window,
  or any other) even when it is covered, so a session can look at its own UI.

.EXAMPLES
  # list candidate windows (title, process, pid, hwnd, bounds)
  pwsh -File see-it.ps1 -List
  pwsh -File see-it.ps1 -List -Process electron

  # capture by window title (substring, case-insensitive); writes a PNG and prints JSON
  pwsh -File see-it.ps1 -Title "Dev Tree" -Out shots\devtree.png
  pwsh -File see-it.ps1 -Hwnd 0x1A2B3C -Out shots\x.png

.NOTES
  - Finds the HWND with UI Automation (top-level elements under the desktop root),
    falls back to EnumWindows for windows UIA skips (tool / layered windows).
  - Captures with PrintWindow(hwnd, PW_RENDERFULLCONTENT=2): renders the window's own
    content, so other windows on top do not matter. Minimized windows cannot be drawn;
    the script restores one without activating it, captures, and minimizes it again.
  - Per-monitor DPI aware, so bounds and pixels are physical (a 560x880 DIP card at
    125% comes out 700x1100).
  - Prints a verdict: "blank" when the picture is one flat colour (a black/white frame
    means capture failed or the page has not painted: wait and retry, never score it).
#>
[CmdletBinding()]
param(
  [string]$Title,
  [string]$Process,
  [string]$Hwnd,
  [string]$DipBounds,   # "x,y,w,h" as interface(op=read).desktop.open[].bounds gives it
  [string]$Out,
  [switch]$List,
  [int]$WaitMs = 0,
  [switch]$Check,       # measure the capture (shot-check.py): blank, surfaces, insets, column edges
  [string]$Lint         # also lint this atom.js / folder against TASTE.md (ui-lint.py)
)
$ErrorActionPreference = 'Stop'

# The System.Drawing interop compiles cleanly only under Windows PowerShell 5.1; from pwsh, hand over.
if ($PSVersionTable.PSEdition -eq 'Core') {
  $argv = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath)
  foreach ($k in $PSBoundParameters.Keys) {
    $v = $PSBoundParameters[$k]
    if ($v -is [switch]) { if ($v) { $argv += "-$k" } } else { $argv += "-$k"; $argv += "$v" }
  }
  & powershell.exe @argv
  exit $LASTEXITCODE
}

Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes, System.Drawing
if (-not ('SeeIt.Native' -as [type])) {
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Runtime.InteropServices;
namespace SeeIt {
public static class Native {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  public delegate bool EnumProc(IntPtr h, IntPtr p);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr p);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern bool SetProcessDpiAwarenessContext(IntPtr v);
  [DllImport("user32.dll")] public static extern uint GetDpiForWindow(IntPtr h);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr h, int a, out RECT r, int size);

  public static void DpiAware() { try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch {} }

  public static List<IntPtr> TopLevel() {
    var l = new List<IntPtr>();
    EnumWindows((h, p) => { if (IsWindowVisible(h) || IsIconic(h)) l.Add(h); return true; }, IntPtr.Zero);
    return l;
  }
  public static string Text(IntPtr h) { var s = new StringBuilder(512); GetWindowText(h, s, 512); return s.ToString(); }
  public static uint Pid(IntPtr h) { uint p; GetWindowThreadProcessId(h, out p); return p; }
  public static RECT Bounds(IntPtr h) {
    RECT r; // DWMWA_EXTENDED_FRAME_BOUNDS = 9: the visible frame, without the invisible resize border
    if (DwmGetWindowAttribute(h, 9, out r, Marshal.SizeOf(typeof(RECT))) != 0) GetWindowRect(h, out r);
    return r;
  }
  // Returns the bitmap and how many distinct colours a coarse sample found (1 = blank).
  public static Bitmap Capture(IntPtr h, out int colours) {
    RECT w; GetWindowRect(h, out w);
    RECT f = Bounds(h);
    int W = w.R - w.L, H = w.B - w.T;
    var full = new Bitmap(Math.Max(W,1), Math.Max(H,1), PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(full)) {
      IntPtr dc = g.GetHdc();
      PrintWindow(h, dc, 2); // PW_RENDERFULLCONTENT
      g.ReleaseHdc(dc);
    }
    // crop the invisible resize border so the PNG is what a person sees
    int x = Math.Max(0, f.L - w.L), y = Math.Max(0, f.T - w.T);
    int cw = Math.Min(W - x, f.R - f.L), ch = Math.Min(H - y, f.B - f.T);
    Bitmap bmp = full;
    if (cw > 0 && ch > 0 && (cw != W || ch != H)) { bmp = full.Clone(new Rectangle(x, y, cw, ch), full.PixelFormat); full.Dispose(); }
    var seen = new HashSet<int>();
    int step = Math.Max(1, Math.Min(bmp.Width, bmp.Height) / 40);
    for (int yy = 0; yy < bmp.Height; yy += step) for (int xx = 0; xx < bmp.Width; xx += step) { seen.Add(bmp.GetPixel(xx, yy).ToArgb()); if (seen.Count > 64) break; }
    colours = seen.Count;
    return bmp;
  }
}}
'@
}
[SeeIt.Native]::DpiAware()

function Get-Windows {
  $rows = @{}
  # 1) UI Automation: top-level windows under the desktop root
  try {
    $root = [System.Windows.Automation.AutomationElement]::RootElement
    $kids = $root.FindAll([System.Windows.Automation.TreeScope]::Children, [System.Windows.Automation.Condition]::TrueCondition)
    foreach ($e in $kids) {
      $h = [IntPtr]$e.Current.NativeWindowHandle
      if ($h -eq [IntPtr]::Zero) { continue }
      $rows[$h.ToInt64()] = [pscustomobject]@{ hwnd = $h; title = $e.Current.Name; pid = $e.Current.ProcessId; via = 'uia' }
    }
  } catch { Write-Verbose "UIA failed: $_" }
  # 2) EnumWindows fallback for anything UIA skipped
  foreach ($h in [SeeIt.Native]::TopLevel()) {
    if ($rows.ContainsKey($h.ToInt64())) { continue }
    $t = [SeeIt.Native]::Text($h)
    if (-not $t) { continue }
    $rows[$h.ToInt64()] = [pscustomobject]@{ hwnd = $h; title = $t; pid = [SeeIt.Native]::Pid($h); via = 'enum' }
  }
  foreach ($r in $rows.Values) {
    $p = Get-Process -Id $r.pid -ErrorAction SilentlyContinue
    $b = [SeeIt.Native]::Bounds($r.hwnd)
    $r | Add-Member process ($p.ProcessName) -PassThru |
         Add-Member bounds ("{0},{1} {2}x{3}" -f $b.L, $b.T, ($b.R - $b.L), ($b.B - $b.T)) -PassThru |
         Add-Member minimized ([SeeIt.Native]::IsIconic($r.hwnd)) -PassThru |
         Add-Member dpi ([SeeIt.Native]::GetDpiForWindow($r.hwnd)) -PassThru |
         Add-Member rect $b -PassThru
  }
}

$all = @(Get-Windows)
if ($Process) { $all = @($all | Where-Object { $_.process -like "*$Process*" }) }

if ($List) {
  $all | Sort-Object process, title | ForEach-Object {
    '{0,-10} {1,-14} {2,6}  {3,-22} {4}{5}' -f ('0x{0:X}' -f $_.hwnd.ToInt64()), $_.process, $_.pid, $_.bounds, $_.title, ($(if ($_.minimized) { '  [minimized]' } else { '' }))
  }
  return
}

if ($Hwnd) {
  $h = [IntPtr][Convert]::ToInt64($Hwnd.Replace('0x', ''), $(if ($Hwnd -like '0x*') { 16 } else { 10 }))
  $win = [pscustomobject]@{ hwnd = $h; title = [SeeIt.Native]::Text($h); process = '' }
} else {
  if (-not $Title -and -not $DipBounds) { throw 'Give -Title, -DipBounds, -Hwnd or -List.' }
  $hits = @($all | Where-Object { -not $Title -or $_.title -like "*$Title*" })
  if ($DipBounds) {
    # Toast reports window places in DIPs; convert each candidate's physical frame by its own DPI.
    $want = $DipBounds -split '[,\s]+' | ForEach-Object { [double]$_ }
    $dip = { param($w) $k = $w.dpi / 96.0; if ($k -le 0) { $k = 1 }
      @(($w.rect.L / $k), ($w.rect.T / $k), (($w.rect.R - $w.rect.L) / $k), (($w.rect.B - $w.rect.T) / $k)) }
    $near = { param($w, $n) $got = & $dip $w; $ok = $true
      for ($i = 0; $i -lt $n; $i++) { if ([math]::Abs($got[$i] - $want[$i]) -gt 12) { $ok = $false } }; $ok }
    $pool = $hits
    $hits = @($pool | Where-Object { & $near $_ 4 })
    # A content-sized card changes its height (and a clamp its width) after apply: match the corner.
    if ($hits.Count -eq 0) { $hits = @($pool | Where-Object { & $near $_ 2 })
      # Other apps can share that corner; a Toast window wins.
      $own = @($hits | Where-Object { $_.process -match 'electron|Toast' }); if ($own.Count -ge 1) { $hits = $own } }
    if ($hits.Count -eq 0) {
      $seen = ($pool | Where-Object { $_.process -match 'electron|Toast' } | ForEach-Object {
        $b = & $dip $_; '0x{0:X} at {1:N0},{2:N0} {3:N0}x{4:N0} DIP' -f $_.hwnd.ToInt64(), $b[0], $b[1], $b[2], $b[3] }) -join '; '
      throw "No window at DIP $DipBounds (corner within 12). Toast windows: $seen. Read interface(op=read).desktop.open[].bounds again, or use -Hwnd."
    }
  }
  $exact = @($hits | Where-Object { $_.title -eq $Title })
  if ($exact.Count -ge 1) { $hits = $exact }
  if ($hits.Count -eq 0) { throw "No window titled like '$Title'. Run -List." }
  if ($hits.Count -gt 1) { throw ("Several windows match '$Title': " + (($hits | ForEach-Object { '0x{0:X} {1} ({2})' -f $_.hwnd.ToInt64(), $_.title, $_.process }) -join '; ') + '. Use -Hwnd.') }
  $win = $hits[0]
}

if (-not $Out) {
  $safe = ($win.title -replace '[^\w\-]+', '-').Trim('-'); if (-not $safe) { $safe = 'window' }
  $Out = Join-Path (Join-Path $PSScriptRoot 'shots') ("{0}-{1:yyyyMMdd-HHmmss}.png" -f $safe, (Get-Date))
}
$Out = [System.IO.Path]::GetFullPath($Out)
New-Item -ItemType Directory -Force (Split-Path $Out) | Out-Null

$wasMin = [SeeIt.Native]::IsIconic($win.hwnd)
if ($wasMin) { [void][SeeIt.Native]::ShowWindow($win.hwnd, 4); Start-Sleep -Milliseconds 400 } # SW_SHOWNOACTIVATE
if ($WaitMs -gt 0) { Start-Sleep -Milliseconds $WaitMs }
$colours = 0
$bmp = [SeeIt.Native]::Capture($win.hwnd, [ref]$colours)
if ($wasMin) { [void][SeeIt.Native]::ShowWindow($win.hwnd, 6) } # SW_MINIMIZE
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$res = [ordered]@{
  path = $Out; hwnd = ('0x{0:X}' -f $win.hwnd.ToInt64()); title = $win.title
  width = $bmp.Width; height = $bmp.Height
  verdict = $(if ($colours -le 1) { 'blank' } else { 'ok' }); sampled_colours = $colours
}
$bmp.Dispose()
$res | ConvertTo-Json -Compress
$fail = 0
if ($Check) {
  "--- shot-check"
  & python (Join-Path $PSScriptRoot 'shot-check.py') $Out
  if ($LASTEXITCODE) { $fail = 1 }
}
if ($Lint) {
  "--- ui-lint $Lint"
  & python (Join-Path $PSScriptRoot 'ui-lint.py') $Lint
  if ($LASTEXITCODE) { $fail = 1 }
}
if ($Check -or $Lint) {
  "--- now open the PNG, crop+2x the bar, a row and the corners, and score R1-R17 in see-it-loop.md"
}
exit $fail
