"""Storyboard sheet: 9 key shots rendered with the film's drawing code, captioned (shot, framing, duration, line)."""
import sys, textwrap
from PIL import Image, ImageDraw, ImageFont
P = sys.argv[1]; out = sys.argv[2]
SHOTS = [
  ('3.9',  '1  Gold ground, first stroke', 'wide, locked then push', '0.0-6.0 s', 'In 1857, the Mughal emperor ruled an empire the size of one fort.'),
  ('9.8',  '2  The emperor under the arch', 'full, push through a cusped arch', '6.0-13.0 s', 'Bahadur Shah Zafar was 81, and a poet. His crown was gold. His power was gone.'),
  ('18.8', '3  Fort and Company', 'pull out + pan right; a coin lands in his bowl', '13.0-20.5 s', 'India was run by a trading company... and it paid him a pension.'),
  ('26.6', '4  Meerut, the cartridge', 'wide, then push in to an insert', '20.5-28.5 s', 'The spark: cartridges rumoured to be greased with cow and pig fat.'),
  ('30.3', '5  The ride to Delhi', 'wide, lateral track; same riders twice', '28.5-34.5 s', 'They rode through the night to Delhi, and asked the old emperor to lead them.'),
  ('36.3', '6  THE TOUCH: crown lights', 'close, locked; hard cut wide at 37.6', '34.5-41.5 s', '(silence, bell) He said yes. For four months, the last Mughal was an emperor again.'),
  ('48.3', '7  Siege and breach', 'wide, pan guns -> wall, roll -2 deg', '41.5-50.5 s', 'The Company struck back... and in September stormed the walls.'),
  ('53.8', '8  Surrender at the tomb', 'full -> wide, slow pull out', '50.5-54.5 s', 'Zafar surrendered at his ancestor\'s tomb.'),
  ('75.2', '9  The crown on the plaque', 'close, locked; one band of light rakes', '67.0-78.0 s', 'Zafar died in 1862, in an unmarked grave. 331 years of Mughal rule had ended in a single summer.'),
]
w, cols = 620, 3; h = w * 9 // 16; cap = 112
F = '/usr/share/fonts/truetype/dejavu/'
fb, fr, fi = ImageFont.truetype(F + 'DejaVuSerif-Bold.ttf', 17), ImageFont.truetype(F + 'DejaVuSans.ttf', 14), ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf', 16)
rows = (len(SHOTS) + cols - 1) // cols
S = Image.new('RGB', (cols * w + (cols + 1) * 14, rows * (h + cap) + (rows + 1) * 14 + 60), (24, 22, 30)); d = ImageDraw.Draw(S)
d.text((14, 16), "The Last Emperor's Crown  -  storyboard  (Gilded Illumination, 1857, ~78 s, English)", font=ImageFont.truetype(F + 'DejaVuSerif-Bold.ttf', 22), fill=(236, 214, 160))
for k, (t, title, frm, dur, line) in enumerate(SHOTS):
    x = 14 + (k % cols) * (w + 14); y = 60 + 14 + (k // cols) * (h + cap + 14)
    S.paste(Image.open(f'{P}/stills/t_{t}.jpg').convert('RGB').resize((w, h)), (x, y))
    d.text((x, y + h + 6), title, font=fb, fill=(240, 232, 214))
    d.text((x, y + h + 30), f'{frm}  |  {dur}', font=fr, fill=(190, 186, 200))
    for i, l in enumerate(textwrap.wrap('"' + line + '"', 74)[:3]): d.text((x, y + h + 52 + i * 18), l, font=fi, fill=(226, 200, 150))
S.save(out, quality=90); print(out, S.size)
