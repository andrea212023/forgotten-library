import os
root=os.path.dirname(os.path.abspath(__file__))
r=lambda p:open(os.path.join(root,p),encoding='utf-8').read()
order=['en','uk','ru','fr','de','es','it','pt','pl','nl','tr','ja','zh','ko','ar','hi']
i18n=''.join(r(f'src/i18n/{c}.js')+'\n' for c in order)
defs='''<svg class="svgdefs" aria-hidden="true" focusable="false"><defs>
<pattern id="hA" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="hl" d="M0 0V6"/></pattern>
<pattern id="hB" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><path class="hl" d="M0 0V6"/></pattern>
<pattern id="hH" width="5" height="5" patternUnits="userSpaceOnUse"><path class="hl" d="M0 0H5"/></pattern>
<pattern id="hV" width="5" height="5" patternUnits="userSpaceOnUse"><path class="hl" d="M0 0V5"/></pattern>
<pattern id="hX" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="hl" d="M0 0V7M0 0H7"/></pattern>
<pattern id="hD" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path class="hl" d="M0 0V3.4"/></pattern>
<pattern id="hBrick" width="24" height="14" patternUnits="userSpaceOnUse"><path class="hl" d="M0 0H24M0 7H24M0 0V7M12 7V14"/></pattern>
<linearGradient id="deepG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".85" stop-color="#000"/></linearGradient>
<mask id="deepMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#deepG)"/></mask>
</defs></svg>'''
fonts='https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=IM+Fell+English:ital@0;1&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Amiri:ital@0;1&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap'
html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Labyrinth of the Forgotten Library</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>
{r('src/style.css')}
</style>
</head>
<body>
{defs}
<div id="app">
<div id="art"></div>
<header class="topbar" id="topbar">
  <div class="brand-label" id="brandLabel"></div>
  <nav class="toolbar">
    <select class="lang" id="langSel"></select>
    <button class="minibtn" id="libBtn"></button>
    <button class="minibtn" id="codexBtn"></button>
    <button class="minibtn" id="historyBtn"></button>
    <button class="minibtn" id="savesBtn"></button>
    <button class="minibtn" id="soundTest"></button>
    <button class="minibtn" id="fullscreenBtn"></button>
    <button class="minibtn" id="newGameBtn"></button>
  </nav>
</header>
<section class="hud hidden" id="hud" aria-live="polite"></section>
<main class="view" id="view"></main>
<div class="hidden" id="dialogRoot"></div>
<div class="hidden" id="timerOverlay"></div>
<div class="hidden" id="modal2"></div>
<div class="hidden" id="toast" role="status"></div>
<input type="file" id="saveInput" accept="application/json,.json" class="hidden">
</div>
<script>window.__I18N={{}};
{i18n}</script>
<script>
{r('src/app.js')}
</script>
</body>
</html>
'''
out=os.path.join(root,'index.html')
open(out,'w',encoding='utf-8').write(html);print(out,len(html.encode())//1024,'KB')
