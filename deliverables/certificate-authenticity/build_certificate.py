from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUTPUT = "/Users/sanchitbabbar/Documents/Windsurf Projects/studio-sanch/deliverables/certificate-authenticity/Studio-Sanch-Certificate-of-Authenticity.docx"

INK = "121212"
SOFT = "6E6A64"
PEARL = "F7F5F0"
GOLD = "96754A"
LINE = "D8D2C8"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=100, start=140, bottom=100, end=140):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=LINE, size="4"):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = qn(f"w:{edge}")
        node = borders.find(tag)
        if node is None:
            node = OxmlElement(f"w:{edge}")
            borders.append(node)
        node.set(qn("w:val"), "single")
        node.set(qn("w:sz"), size)
        node.set(qn("w:space"), "0")
        node.set(qn("w:color"), color)


def set_repeat_table_layout_fixed(table):
    tbl_pr = table._tbl.tblPr
    layout = tbl_pr.first_child_found_in("w:tblLayout")
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")


def set_run_font(run, name="Avenir Next", size=10, color=INK, bold=False, italic=False, spacing=None):
    run.font.name = name
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold
    run.italic = italic
    if spacing is not None:
        r_pr = run._element.get_or_add_rPr()
        sp = r_pr.find(qn("w:spacing"))
        if sp is None:
            sp = OxmlElement("w:spacing")
            r_pr.append(sp)
        sp.set(qn("w:val"), str(spacing))


def add_run(paragraph, text, **kwargs):
    run = paragraph.add_run(text)
    set_run_font(run, **kwargs)
    return run


def set_para(paragraph, before=0, after=0, line=1.0, align=None, keep=False):
    fmt = paragraph.paragraph_format
    fmt.space_before = Pt(before)
    fmt.space_after = Pt(after)
    fmt.line_spacing = line
    fmt.keep_with_next = keep
    if align is not None:
        paragraph.alignment = align


def add_label_value(cell, label, value=""):
    cell.text = ""
    p = cell.paragraphs[0]
    set_para(p, after=1)
    add_run(p, label.upper(), size=7.2, color=GOLD, bold=True, spacing=28)
    p2 = cell.add_paragraph()
    set_para(p2, after=0)
    add_run(p2, value if value else "________________________________________________", size=9.4, color=INK)


doc = Document()
section = doc.sections[0]
section.page_width = Inches(8.5)
section.page_height = Inches(11)
section.top_margin = Inches(0.46)
section.bottom_margin = Inches(0.44)
section.left_margin = Inches(0.55)
section.right_margin = Inches(0.55)

# Pearl paper tone and restrained bronze page border.
sect_pr = section._sectPr
pg_borders = OxmlElement("w:pgBorders")
pg_borders.set(qn("w:offsetFrom"), "page")
for edge in ("top", "left", "bottom", "right"):
    el = OxmlElement(f"w:{edge}")
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), "8")
    el.set(qn("w:space"), "20")
    el.set(qn("w:color"), GOLD)
    pg_borders.append(el)
sect_pr.append(pg_borders)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Avenir Next"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Avenir Next")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Avenir Next")
normal.font.size = Pt(9.2)
normal.font.color.rgb = RGBColor.from_string(INK)

title_style = styles["Title"]
title_style.font.name = "Didot"
title_style._element.rPr.rFonts.set(qn("w:ascii"), "Didot")
title_style._element.rPr.rFonts.set(qn("w:hAnsi"), "Didot")
title_style.font.size = Pt(25)
title_style.font.color.rgb = RGBColor.from_string(INK)
title_style.font.bold = False
title_ppr = title_style._element.get_or_add_pPr()
title_border = title_ppr.find(qn("w:pBdr"))
if title_border is not None:
    title_ppr.remove(title_border)

header = doc.add_table(rows=1, cols=2)
header.alignment = WD_TABLE_ALIGNMENT.CENTER
header.autofit = False
header.columns[0].width = Inches(4.8)
header.columns[1].width = Inches(2.55)
set_table_borders(header, color=LINE, size="2")
set_repeat_table_layout_fixed(header)
for cell in header.rows[0].cells:
    set_cell_margins(cell, top=65, bottom=65)
    set_cell_shading(cell, PEARL)
left = header.cell(0, 0)
left.text = ""
p = left.paragraphs[0]
add_run(p, "SANCH", size=12.5, bold=True, spacing=120)
right = header.cell(0, 1)
right.text = ""
p = right.paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
add_run(p, "CERTIFICATE  NO", size=7.2, color=GOLD, bold=True, spacing=22)
add_run(p, "   __________________", size=8.5, color=INK)

title = doc.add_paragraph(style="Title")
set_para(title, before=8, after=0, align=WD_ALIGN_PARAGRAPH.CENTER)
title.add_run("Certificat d'authenticité")

subtitle = doc.add_paragraph()
set_para(subtitle, after=8, align=WD_ALIGN_PARAGRAPH.CENTER)
add_run(subtitle, "CERTIFICATE OF AUTHENTICITY", size=7.4, color=GOLD, bold=True, spacing=95)

record = doc.add_table(rows=1, cols=2)
record.alignment = WD_TABLE_ALIGNMENT.CENTER
record.autofit = False
record.columns[0].width = Inches(2.25)
record.columns[1].width = Inches(5.1)
set_table_borders(record, color=LINE, size="4")
set_repeat_table_layout_fixed(record)
record.rows[0].height = Inches(3.65)
record.rows[0].height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST

photo = record.cell(0, 0)
photo.text = ""
photo.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
set_cell_shading(photo, PEARL)
set_cell_margins(photo, top=120, start=110, bottom=110, end=110)
p = photo.paragraphs[0]
set_para(p, before=40, after=5, align=WD_ALIGN_PARAGRAPH.CENTER)
add_run(p, "IMAGE DE L'ŒUVRE", size=7.2, color=GOLD, bold=True, spacing=30)
p = photo.add_paragraph()
set_para(p, after=92, align=WD_ALIGN_PARAGRAPH.CENTER)
add_run(p, "ARTWORK IMAGE", size=6.7, color=SOFT, spacing=28)
p = photo.add_paragraph()
set_para(p, align=WD_ALIGN_PARAGRAPH.CENTER)
add_run(p, "Photographie facultative\nOptional photograph", size=8, color=SOFT, italic=True)

meta = record.cell(0, 1)
meta.text = ""
set_cell_margins(meta, top=70, start=105, bottom=70, end=105)
set_cell_shading(meta, "FFFFFF")
metadata = [
    ("Titre de l'œuvre  Artwork title", ""),
    ("Statut de l'édition  Edition status", "☐ Pièce unique   ☐ N° ______ / ______"),
    ("Technique et matériaux  Technique and materials", ""),
    ("Support  Medium", ""),
    ("Dimensions", ""),
    ("Année de création  Year of creation", ""),
    ("Emplacement de la signature  Signature location", ""),
]
for idx, (label, value) in enumerate(metadata):
    p = meta.paragraphs[0] if idx == 0 else meta.add_paragraph()
    set_para(p, before=5 if idx else 0, after=1)
    add_run(p, label.upper(), size=6.6, color=GOLD, bold=True, spacing=15)
    p2 = meta.add_paragraph()
    set_para(p2, after=3)
    add_run(p2, value if value else "____________________________________________", size=8.8, color=INK)

decl = doc.add_paragraph()
set_para(decl, before=7, after=2, line=1.06)
add_run(decl, "DÉCLARATION DE L'ARTISTE", size=7, color=GOLD, bold=True, spacing=30)
p = doc.add_paragraph()
set_para(p, after=2, line=1.1)
add_run(p, "Je soussigné, Sanchit Babbar, artiste-auteur, certifie que l'œuvre désignée ci-dessus est l'original et une pièce unique, ou le numéro indiqué d'une série limitée au nombre d'exemplaires déclaré.", size=8.5)
p = doc.add_paragraph()
set_para(p, after=5, line=1.1)
add_run(p, "I, the undersigned, Sanchit Babbar, artist-author, certify that the work identified above is the original and either a unique work or the stated number from a limited edition of the declared size.", size=8.1, color=SOFT, italic=True)

legal = doc.add_table(rows=2, cols=2)
legal.alignment = WD_TABLE_ALIGNMENT.CENTER
legal.autofit = False
legal.columns[0].width = Inches(3.67)
legal.columns[1].width = Inches(3.67)
set_table_borders(legal, color=LINE, size="3")
set_repeat_table_layout_fixed(legal)
fields = [
    (0, 0, "N° PROFESSIONNEL  PROFESSIONAL REGISTRATION", "Maison des Artistes / SIRET  __________________"),
    (0, 1, "RÉFÉRENCE D'ARCHIVE  ARCHIVE REFERENCE", "________________________________________"),
    (1, 0, "DATE DE DÉLIVRANCE  DATE OF ISSUE", "________________________________________"),
    (1, 1, "LIEU DE DÉLIVRANCE  PLACE OF ISSUE", "Paris, France  /  __________________________"),
]
for row, col, label, value in fields:
    cell = legal.cell(row, col)
    set_cell_margins(cell, top=65, start=105, bottom=65, end=105)
    set_cell_shading(cell, "FFFFFF" if row == 0 else PEARL)
    add_label_value(cell, label, value)

p = doc.add_paragraph()
set_para(p, before=5, after=1.5, line=1.05)
add_run(p, "Le présent certificat et les mentions qui y figurent constituent le droit de propriété de l'œuvre.", size=8.2, bold=True)
p = doc.add_paragraph()
set_para(p, after=5, line=1.05)
add_run(p, "This certificate and the particulars recorded herein constitute the title of ownership of the work.", size=7.8, color=SOFT, italic=True)

signatures = doc.add_table(rows=1, cols=2)
signatures.alignment = WD_TABLE_ALIGNMENT.CENTER
signatures.autofit = False
signatures.columns[0].width = Inches(4.65)
signatures.columns[1].width = Inches(2.7)
set_table_borders(signatures, color=LINE, size="4")
set_repeat_table_layout_fixed(signatures)
for cell in signatures.rows[0].cells:
    set_cell_margins(cell, top=65, start=110, bottom=65, end=110)
    set_cell_shading(cell, "FFFFFF")
add_label_value(signatures.cell(0, 0), "Signature de l'artiste  Artist signature", "")
add_label_value(signatures.cell(0, 1), "Cachet  Seal", "")
for cell in signatures.rows[0].cells:
    spacer = cell.add_paragraph()
    set_para(spacer, before=10, after=0)
    add_run(spacer, " ", size=9)

footer = doc.add_paragraph()
set_para(footer, before=5, align=WD_ALIGN_PARAGRAPH.CENTER)
add_run(footer, "STUDIO SANCH   ·   PARIS FRANCE   ·   STUDIOSANCH.COM", size=6.7, color=GOLD, bold=True, spacing=45)

doc.core_properties.title = "Studio Sanch Certificate of Authenticity"
doc.core_properties.subject = "Certificate accompanying an original artwork or limited edition"
doc.core_properties.author = "Studio Sanch"
doc.core_properties.keywords = "certificate, authenticity, artwork, Studio Sanch, Sanchit Babbar"
doc.save(OUTPUT)
print(OUTPUT)
