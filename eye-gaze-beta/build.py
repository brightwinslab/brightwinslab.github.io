# Builds index.html from src.html (inlines the icon sprite shared with the printable page). Run: python3 build.py
import os
H=os.path.dirname(os.path.abspath(__file__))
s=open(f'{H}/src.html').read().replace('{{SPRITE}}',open(f'{H}/../printable-chore-chart/sprite.txt').read().strip())
open(f'{H}/index.html','w').write(s)
