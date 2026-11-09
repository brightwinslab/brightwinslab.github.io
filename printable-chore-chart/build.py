# Builds index.html from src.html: inlines the icon sprite and the QR code (qr.txt -> https://brightwinslab.com/). Run: python3 build.py
import os
H=os.path.dirname(os.path.abspath(__file__))
s=open(f'{H}/src.html').read()
sp=open(f'{H}/sprite.txt').read()
s=s.replace('{{SPRITE}}',sp.strip()).replace('{{QR}}',open(f'{H}/qr.txt').read())
open(f'{H}/index.html','w').write(s)
