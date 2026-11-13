# Windows startup: installs deps if needed, optionally ensures Bifrost is up, then starts API + web.
if (-not (Test-Path node_modules)) { npm install }
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host "Created .env - add TAVILY_API_KEY and ANTHROPIC_API_KEY, then rerun."; exit 1 }
$bifrost = (Select-String -Path .env -Pattern '^BIFROST_ENABLED=true' -Quiet)
if ($bifrost) {
  try { Invoke-WebRequest http://localhost:8080/health -UseBasicParsing -TimeoutSec 2 | Out-Null; Write-Host "Bifrost already running." }
  catch { Write-Host "Bifrost not reachable. Start it with: npx -y @maximhq/bifrost  (see docs/SETUP.md) or set BIFROST_ENABLED=false for direct Anthropic." }
}
npm run dev
