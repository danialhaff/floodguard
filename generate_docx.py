import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_callout(doc, text_list, title="CATATAN / FORMULA", border_color="0284C7", bg_color="F0F9FF"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    
    # Left border only
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>
            <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
            <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(f"📌 {title}\n" if title else "")
    run_t.bold = True
    run_t.font.name = "Segoe UI"
    run_t.font.size = Pt(10.5)
    run_t.font.color.rgb = RGBColor(2, 132, 199)
    
    for t in text_list:
        p2 = cell.add_paragraph()
        p2.paragraph_format.space_before = Pt(2)
        p2.paragraph_format.space_after = Pt(2)
        r = p2.add_run(t)
        r.font.name = "Segoe UI"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(30, 41, 59)
    
    # add spacing after table
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def add_code_block(doc, code_str, lang="PYTHON / SCRIPT"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:left w:val="single" w:sz="12" w:space="0" w:color="0284C7"/>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=160)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    run_h = p.add_run(f"💻 {lang}\n")
    run_h.bold = True
    run_h.font.name = "Consolas"
    run_h.font.size = Pt(8.5)
    run_h.font.color.rgb = RGBColor(100, 116, 139)
    
    run_c = p.add_run(code_str.strip())
    run_c.font.name = "Consolas"
    run_c.font.size = Pt(9)
    run_c.font.color.rgb = RGBColor(15, 23, 42)
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def build_word_document():
    doc = docx.Document()
    
    # Page Setup: Standard A4 or Letter, 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("FLOODGUARD | Dokumentasi Lengkap Sistem & Seni Bina (Taman Sri Muda)")
        hrun.font.name = "Segoe UI"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("FloodGuard Web GIS Project — Final Year Project (UniKL Software Engineering)")
        frun.font.name = "Segoe UI"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # Document Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)

    # --- TITLE SECTION ---
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("DOKUMENTASI LENGKAP SISTEM FLOODGUARD")
    run_title.bold = True
    run_title.font.name = "Segoe UI"
    run_title.font.size = Pt(22)
    run_title.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(16)
    run_sub = p_sub.add_run("Sistem Amaran Awal Banjir, Simulasi Topografi & Pusat Kawalan Bencana (Taman Sri Muda, Seksyen 25 Shah Alam)")
    run_sub.font.name = "Segoe UI"
    run_sub.font.size = Pt(12)
    run_sub.font.color.rgb = RGBColor(2, 132, 199) # Sky 600
    
    # Metadata Box Table
    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_tbl.autofit = False
    set_table_borders(meta_tbl, color="E2E8F0", sz="4")
    
    meta_data = [
        ("Nama Projek:", "FloodGuard Smart Early Warning & Evacuation Command Center"),
        ("Kajian Kes / Lokasi:", "Taman Sri Muda, Seksyen 25, Shah Alam, Selangor"),
        ("Pembangun / Penyelidik:", "Muhammad Danial Hafiz (UniKL Software Engineering)"),
        ("Repositori Git Rasmi:", "https://github.com/danialhaff/floodguard")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_tbl.rows[idx]
        cell_lbl = row.cells[0]
        cell_lbl.width = Inches(2.2)
        set_cell_background(cell_lbl, "F8FAFC")
        set_cell_margins(cell_lbl, top=80, bottom=80, left=120, right=100)
        p1 = cell_lbl.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(label)
        r1.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(71, 85, 105)
        
        cell_val = row.cells[1]
        cell_val.width = Inches(4.3)
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_val, top=80, bottom=80, left=120, right=100)
        p2 = cell_val.paragraphs[0]
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        r2 = p2.add_run(val)
        r2.font.size = Pt(9.5)
        r2.font.color.rgb = RGBColor(15, 23, 42)
        if "http" in val:
            r2.font.color.rgb = RGBColor(2, 132, 199)
            r2.underline = True

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(15)
        r.font.color.rgb = RGBColor(15, 23, 42)
        
        # Add subtle accent bottom bar
        p_subbar = doc.add_paragraph()
        p_subbar.paragraph_format.space_before = Pt(0)
        p_subbar.paragraph_format.space_after = Pt(8)
        p_subbar.paragraph_format.keep_with_next = True
        r_line = p_subbar.add_run("━" * 58)
        r_line.font.size = Pt(7)
        r_line.font.color.rgb = RGBColor(2, 132, 199)

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(12.5)
        r.font.color.rgb = RGBColor(2, 132, 199)

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.bold = True
        r.font.name = "Segoe UI"
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor(30, 41, 59)

    def add_p(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.bold = True
            rb.font.color.rgb = RGBColor(15, 23, 42)
        
        # simple parsing of markdown bold (**word**) and italic (*word*)
        parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                r = p.add_run(part[2:-2])
                r.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            elif part.startswith('*') and part.endswith('*'):
                r = p.add_run(part[1:-1])
                r.italic = True
                r.font.color.rgb = RGBColor(71, 85, 105)
            elif part.startswith('`') and part.endswith('`'):
                r = p.add_run(part[1:-1])
                r.font.name = "Consolas"
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(194, 65, 12) # orange-dark
            else:
                p.add_run(part)

    def add_bullet(text, prefix="• "):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.25)
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        
        parts = re.split(r'(\*\*.*?\*\*|\*.*?\*|`.*?`)', text)
        r_pre = p.add_run(prefix)
        r_pre.bold = True
        r_pre.font.color.rgb = RGBColor(2, 132, 199)
        
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                r = p.add_run(part[2:-2])
                r.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            elif part.startswith('*') and part.endswith('*'):
                r = p.add_run(part[1:-1])
                r.italic = True
            elif part.startswith('`') and part.endswith('`'):
                r = p.add_run(part[1:-1])
                r.font.name = "Consolas"
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(194, 65, 12)
            else:
                p.add_run(part)

    # ==========================================
    # SECTION 1: PENGENALAN & TEORI SAINTIFIK
    # ==========================================
    add_h1("1. PENGENALAN & TEORI SAINTIFIK (GEOSPATIAL & HIDROLOGI)")
    
    add_h2("1.1 Masalah Geografi Taman Sri Muda (Kajian Kes Banjir 2021)")
    add_p("Taman Sri Muda (Seksyen 25, Shah Alam) terletak di dalam likuan Sungai Klang (*Klang River meander*). Dari sudut geomorfologi, kawasan ini adalah dataran banjir semula jadi (*natural floodplain*) yang telah dibangunkan menjadi kawasan perumahan berkepadatan tinggi.")
    add_p("Banjir besar 17–18 Disember 2021 membuktikan bahawa punca utama bencana ini bukan sahaja kuantiti hujan lebat (melebihi 380 mm dalam tempoh 24 jam), tetapi gabungan tiga faktor utama:")
    
    add_bullet("**Bentuk Mangkuk Tadahan (Basin Effect):** Kawasan tengah Taman Sri Muda mempunyai elevasi tanah serendah **8.7 meter dari aras laut**.", "1. ")
    add_bullet("**Ketinggian Tebing Sungai Klang:** Paras banjaran tebing sungai berada pada sekitar 11.5m – 12.0m. Apabila paras air sungai meningkat melebihi paras ini, air melimpah masuk ke dalam kawasan perumahan dan terperangkap kerana sistem perparitan graviti tidak lagi dapat mengalirkan air keluar ke sungai (*backflow phenomenon*).", "2. ")
    add_bullet("**Ketiadaan Sistem Penyelarasan Masa-Nyata:** Penduduk tidak mengetahui paras kedalaman air di lorong mereka, laluan keluar mana yang telah tenggelam, dan panggilan kecemasan 999 mengalami *choke point* kerana ketiadaan koordinat GPS yang tepat bagi setiap mangsa.", "3. ")

    add_h2("1.2 Data Ketinggian Tanah: NASA SRTM Digital Elevation Model (DEM)")
    add_p("Projek FloodGuard **bukan berasaskan data rekaan (*mock data*)**. Sistem ini menggunakan data topografi satelit sebenar:")
    add_bullet("**Sumber:** NASA Shuttle Radar Topography Mission (SRTM) 30-meter / 90-meter resolution melalui dataset DIVA-GIS (`MYS_alt`).")
    add_bullet("**Fail Asal:** `data/raster/MYS_alt.vrt` (Virtual Raster Dataset) bersama fail binari `.gri` dan grid header `.grd`.")
    add_bullet("**Sistem Koordinat Spatial:** EPSG:4326 (WGS 84 - World Geodetic System 1984) menggunakan latitud dan longitud darjah perpuluhan.")

    add_h3("Bagaimana Ketinggian Tanah Diekstrak Dari Satelit (extract_elevation.py):")
    code_elevation = '''import rasterio

# Membuka fail raster elevasi Malaysia
with rasterio.open("data/raster/MYS_alt.vrt") as src:
    # Mengubah koordinat geografi (lat, lng) ke indeks piksel (row, col)
    row, col = src.index(lng, lat)
    # Membaca nilai ketinggian sebenar dari aras laut (dalam meter)
    elevation = src.read(1)[row, col]'''
    add_code_block(doc, code_elevation, "PYTHON RASTERIO DEM EXTRACTION")

    add_h3("Jadual Nilai Elevasi Sebenar Mengikut Zon Kejiranan Sri Muda:")
    
    # Table for Elevation
    elev_tbl = doc.add_table(rows=6, cols=4)
    elev_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    elev_tbl.autofit = False
    set_table_borders(elev_tbl, color="CBD5E1", sz="6")
    
    headers = ["Zon Kejiranan", "Koordinat Centroid", "Ketinggian Aras Laut (DEM)", "Kategori Risiko"]
    col_widths = [Inches(1.8), Inches(1.5), Inches(1.5), Inches(1.7)]
    
    hdr_row = elev_tbl.rows[0]
    for i, h in enumerate(headers):
        c = hdr_row.cells[i]
        c.width = col_widths[i]
        set_cell_background(c, "0284C7")
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    elev_rows = [
        ("Central Zone (Pusat Bandar/Tengah)", "3.0310, 101.5360", "8.7 meter", "Paling Bahaya (Basin Lowest Point)"),
        ("South Zone (Selatan)", "3.0230, 101.5370", "9.1 meter", "Sangat Tinggi (Limpahan Rendah)"),
        ("East Zone (Timur)", "3.0308, 101.5450", "10.2 meter", "Tinggi (Bersebelahan Sungai)"),
        ("North Zone (Utara)", "3.0375, 101.5340", "11.3 meter", "Sederhana (Kawasan Relatif Tinggi)"),
        ("West Zone (Barat)", "3.0290, 101.5265", "12.5 meter", "Rendah (Tanah Tinggi / Keluar LKSA)")
    ]
    
    for r_idx, row_data in enumerate(elev_rows, start=1):
        row = elev_tbl.rows[r_idx]
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            if c_idx in [1, 2]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0:
                r.bold = True
            if "8.7 meter" in val or "Paling Bahaya" in val:
                r.bold = True
                r.font.color.rgb = RGBColor(220, 38, 38)
            else:
                r.font.color.rgb = RGBColor(30, 41, 59)
                
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_h2("1.3 Algoritma Simulasi Air Organik (Organic Flood Spread Engine)")
    add_p("Simulasi banjir konvensional sering menggunakan bulatan statik yang tidak realistik. FloodGuard membangunkan algoritma **Hydrological Procedural Synthesis** berasaskan matematik dalam `frontend/js/script.js`:")
    
    formula_callout = [
        "Vulnerability(lat, lng) = w₁ · ProximityToRiver(lat, lng) + w₂ · FBMNoise(r, c) + w₃ · InvertedElevation",
        "Pemberat Formula: w₁ = 0.40 (Jarak ke tebing Sungai Klang), w₂ = 0.35 (Tekstur hingar rekahan bumi FBM), w₃ = 0.25 (Pembalikan ketinggian topografi DEM NASA)."
    ]
    add_callout(doc, formula_callout, "FORMULA KERENTANAN & SIMULASI BANJIR ORGANIK")
    
    add_bullet("**Fractal Brownian Motion (FBM) Multi-Octave Noise:** Menggabungkan beberapa lapisan frekuensi hingar (*noise octaves*) untuk menghasilkan sempadan air yang berliku mengikut tekstur muka bumi sebenar, bukan garisan geometri lurus.")
    add_bullet("**Radial Epicenter Proximity:** Dua titik episenter limpahan sungai ditakrifkan berhampiran tebing Sungai Klang (`3.0270, 101.5420` dan `3.0350, 101.5380`). Semakin dekat suatu sel grid dengan episenter tebing, semakin tinggi kebarangkalian air bertakung.")
    add_bullet("**Klasifikasi Kedalaman Air Dinamik (Estimated Water Depth):**")
    add_bullet("< 0.3m (Paras Buku Lali / Ankle Deep): Air bertakung ringan, jalan masih selamat dilalui semua kenderaan.", "   ▫ ")
    add_bullet("0.3m – 0.7m (Paras Lutut / Knee Deep): Bahaya untuk kereta sedan; kenderaan pacuan 4 roda (4WD) mula berwaspada.", "   ▫ ")
    add_bullet("0.7m – 1.2m (Paras Pinggang / Waist Deep): Jalan terputus, kereta kecil tenggelam, pemindahan kecemasan wajib dimulakan.", "   ▫ ")
    add_bullet("1.2m – 1.8m (Paras Dada / Chest Deep): Paras kritikal mengancam nyawa, pemindahan menggunakan bot penyelamat sahaja.", "   ▫ ")
    add_bullet("> 1.8m (Tenggelam / Submerged): Bumbung kenderaan tenggelam sepenuhnya, kediaman satu tingkat ditenggelami air.", "   ▫ ")

    add_h2("1.4 Teori Navigasi Laluan: Mengapa OSRM Road Routing?")
    add_bullet("**Masalah Pendekatan Garisan Lurus:** Garisan lurus (*Euclidean straight-line*) sebelum ini merentas bangunan rumah, sungai, dan parit besar yang mustahil dilalui oleh manusia.")
    add_bullet("**Penyelesaian Kejuruteraan OSRM:** FloodGuard menggunakan **Open Source Routing Machine (OSRM)** dengan mengekstrak 436 titik nod jalan sebenar (*turn-by-turn road network*):")
    add_bullet("**North Zone:** Melalui Jalan Bakti 25/15 → Jalan Persiaran Budiman → **Dewan Kenangan MBSA Seksyen 28**.", "   ▫ ")
    add_bullet("**East Zone:** Melalui Jalan Sabar 25/83 → Lorong Sabar → **SK Taman Sri Muda**.", "   ▫ ")
    add_bullet("**Central Zone:** Melalui Jalan Makmur 25/64 → Jalan Mewah 25/63 → **Dewan Azalea Seksyen 25**.", "   ▫ ")
    add_bullet("**South & West Zones:** Melalui Persiaran Tengku Ampuan keluar terus ke **SK Seksyen 16 Shah Alam**.", "   ▫ ")

    # ==========================================
    # SECTION 2: SENI BINA SISTEM & WORKFLOW
    # ==========================================
    add_h1("2. SENI BINA SISTEM (SYSTEM ARCHITECTURE & DATA FLOW)")
    add_p("FloodGuard menggunakan seni bina moden berlapis (Multi-Tier Layered Architecture) yang memisahkan antara lapisan persembahan, logik perkhidmatan, pangkalan data spatial, dan integrasi penderia satelit luar.")
    
    arch_box = [
        "1. Client Layer (Antaramuka Pengguna):",
        "   • Public Web Portal (index.html): Orang awam, simulasi banjir, carian cuaca, panggilan kecemasan SOS.",
        "   • Bomba Command Center (responder.html): Peta insiden langsung, butang dispatch bot penyelamat, pemantauan dewan PPS.",
        "   • Admin Dashboard (admin.html): Pengurusan data master zon banjir, PPS, dan arkib rekod hujan.",
        "2. Service & Gateway Layer:",
        "   • HTTP Web Server (Port 3000 / Nginx) untuk fail antaramuka statik.",
        "   • FastAPI REST Backend (Port 8000) untuk pengiraan logik, validasi nombor telefon, dan CRUD spatial.",
        "3. External Integration Services:",
        "   • NASA SRTM DEM (MYS_alt.vrt): Data ketinggian muka bumi sebenar.",
        "   • OpenWeatherMap API: Data hujan stesen cuaca Shah Alam secara langsung.",
        "   • Google Maps Tile Server & ESRI Dark Canvas: Basemap geospatial resolusi tinggi.",
        "4. Persistence & Spatial Layer:",
        "   • Supabase Cloud PostGIS (Primary) / Resilient Local SQLite Spatial Engine (Fallback)."
    ]
    add_callout(doc, arch_box, "SENI BINA BERLAPIS (MULTI-TIER ARCHITECTURE)")

    add_h2("2.1 Aliran Data Panggilan Kecemasan (SOS Dispatch Workflow)")
    add_p("Berikut merupakan kitaran lengkap aliran data dari saat butang SOS ditekan sehingga pasukan bomba tiba di lokasi mangsa:")
    add_bullet("1. Mangsa Banjir menekan butang SOS pada portal awam dan mengisi Nama serta Nombor Telefon.")
    add_bullet("2. Frontend `script.js` memvalidasi nombor telefon mengikut format piawai Malaysia (`^01[0-9]...`) dan mengekstrak koordinat GPS semasa peranti.")
    add_bullet("3. Frontend menghantar payload `POST /sos` ke FastAPI Backend.")
    add_bullet("4. Backend menyimpan rekod ke dalam jadual `sos_requests` dengan status awal 'Pending' dan menjana ID unik.")
    add_bullet("5. Portal Bomba (`responder.html`) menjalankan auto-polling setiap 10 saat (`GET /admin/sos`).")
    add_bullet("6. Pin merah berdenyut (*pulse marker*) muncul pada peta bomba beserta perincian nama mangsa dan jarak kedalaman air semasa.")
    add_bullet("7. Pegawai Bomba menekan 'Dispatch Unit' (`PUT /admin/sos/{id}/status`), menukar status kepada 'Dispatched' dan menghantar bot penyelamat.")

    # ==========================================
    # SECTION 3: PERINCIAN 14 MODUL SISTEM
    # ==========================================
    add_h1("3. PERINCIAN 14 MODUL SISTEM (COMPREHENSIVE MODULE BREAKDOWN)")
    add_p("Sistem FloodGuard merangkumi 14 modul fungsian lengkap yang saling melengkapi bagi menjamin operasi pengurusan bencana yang pantas dan tepat:")

    modules = [
        ("Modul 1: User Authentication & Role-Based Access Control (RBAC)",
         "Mengawal keselamatan sistem dengan membezakan akses antara orang awam, pentadbir sistem, dan pasukan kecemasan Bomba.",
         "backend/main.py, frontend/login.html, frontend/js/admin.js",
         "POST /admin/login menerima kelayakan pengguna. Sesi 'admin' dialihkan ke admin.html, manakala 'bomba' dialihkan ke responder.html dengan sesi selamat sessionStorage."),
         
        ("Modul 2: Topographic Flood Simulation & Depth Inundation Engine",
         "Menjana simulasi visual aras limpahan air banjir yang realistik berasaskan nilai ketinggian sebenar tanah (DEM) dan taburan hujan.",
         "backend/main.py, frontend/js/script.js",
         "GET /simulate mengira nisbah kedalaman air berasaskan elevasi tanah. Skala ketelusan warna (opacity 0.16–0.43) mengekalkan keterlihatan nama jalan Google Maps."),
         
        ("Modul 3: Live Meteorological Data Integration (Weather Sync)",
         "Menyegerakkan bacaan hujan semasa secara automatik tanpa input manual pengguna melalui integrasi stesen cuaca.",
         "backend/main.py, frontend/index.html",
         "GET /weather/live menghubungi API OpenWeatherMap stesen Shah Alam (lat 3.0336, lon 101.5311) dengan ciri Automated Fallback jika sambungan terputus."),
         
        ("Modul 4: Road-Network Evacuation Routing & Zone Focus Module",
         "Menunjukkan laluan jalan raya keluar selamat dari 5 zon kejiranan ke pusat pemindahan (PPS) mengikut jaringan jalan sebenar.",
         "frontend/js/script.js, frontend/css/style.css",
         "436 koordinat laluan OSRM, penunjuk arah chevron kemas 12px, dan bar butang fokus zon (focusZone) yang menyerlahkan laluan pilihan dengan garisan neon berdenyut."),
         
        ("Modul 5: Emergency Citizen SOS & Geolocation Dispatch",
         "Membolehkan mangsa banjir terperangkap meminta bantuan kecemasan dengan satu sentuhan butang beserta koordinat GPS.",
         "frontend/index.html, frontend/js/script.js, backend/main.py",
         "POST /sos menerima nama, nombor telefon (regex disahkan), dan koordinat GPS mangsa untuk dimasukkan ke dalam antrian tindakan penyelamat."),
         
        ("Modul 6: First Responder Command Center (Bomba Dispatch)",
         "Pusat arahan khas bagi agensi penyelamat (JBPM/NADMA) menguruskan misi menyelamat dan menghantar bot ke lokasi mangsa.",
         "frontend/responder.html, frontend/js/responder.js, frontend/css/responder.css",
         "Peta insiden langsung dengan pin beranimasi denyutan, kaunter status 'Pending' vs 'Dispatched', dan endpoint PUT /admin/sos/{id}/status."),
         
        ("Modul 7: Evacuation Centers (PPS) Occupancy Monitoring",
         "Memantau kapasiti muatan mangsa di Pusat Pemindahan Sementara agar agensi tidak menghantar mangsa ke dewan yang sudah penuh.",
         "backend/main.py, frontend/js/responder.js",
         "Pengiraan ambang kapasiti: <=50% (Cyan Selamat), 51-80% (Kuning Waspada), >80% (Merah Amaran Dewan Penuh)."),
         
        ("Modul 8: System Administration & Spatial Data Management (Admin CRUD)",
         "Membolehkan pentadbir menguruskan data asas sistem (zon banjir, PPS, rekod sejarah) tanpa memerlukan perisian pangkalan data luaran.",
         "frontend/admin.html, frontend/js/admin.js",
         "Menyediakan endpoint RESTful: GET /admin/stats, GET /admin/zones, POST /admin/zones, dan kemas kini kapasiti PPS."),
         
        ("Modul 9: Dynamic Safety Advisory & Action Checklist",
         "Memberikan panduan keselamatan langkah demi langkah kepada penduduk mengikut tahap amaran dan ketinggian air semasa.",
         "frontend/index.html, frontend/js/script.js",
         "Menjana senarai semak automatik: Selamat (0mm), Rendah (1-50mm), Sederhana (51-100mm), Tinggi (101-150mm), dan Bahaya (>150mm)."),
         
        ("Modul 10: Satellite DEM Topographic Extraction Subsystem",
         "Saluran paip pengekstrakan saintifik bagi mendapatkan koordinat elevasi tepat tanah Sri Muda daripada data satelit NASA SRTM.",
         "extract_elevation.py, data/raster/MYS_alt.vrt",
         "Membaca piksel altitud GeoTIFF/VRT menggunakan rasterio dan memetakan nilai ketinggian kepada jadual spatial flood_zones dalam format EWKT."),
         
        ("Modul 11: Multi-Layer Interactive Web GIS Basemap Engine",
         "Enjin peta berlapis yang membolehkan pengguna dan anggota bomba memilih jenis paparan peta yang optimum mengikut keadaan operasi.",
         "frontend/js/script.js, frontend/js/responder.js",
         "Menyokong Google Maps Roadmap, Google Terrain, Google Satellite, OpenStreetMap, dan ESRI World Dark Canvas tanpa sekatan API key."),
         
        ("Modul 12: Historical Rainfall & Flood Event Logging Module",
         "Arkib rekod sejarah kejadian banjir untuk rujukan analisis bencana masa lampau dan kajian trend hidrologi.",
         "backend/main.py, backend/models.py",
         "Menyimpan tarikh, taburan hujan (mm), dan huraian impak fizikal seperti rekod banjir 380 mm pada Disember 2021."),
         
        ("Modul 13: Mobile-Responsive Adaptive UI & Gesture Drawer",
         "Memastikan aplikasi boleh digunakan dengan pantas, lancar, dan selesa pada skrin telefon pintar mangsa banjir.",
         "frontend/css/style.css, frontend/js/script.js",
         "Bottom sheet drawer (#mobile-drawer) dengan touch handle, swipe-to-dismiss gesture, dan auto-hide butang SOS apabila panel dibuka."),
         
        ("Modul 14: Resilient Spatial Database & Hybrid SQLite/PostGIS Engine",
         "Menjamin sistem boleh beroperasi di mana-mana peranti komputer tanpa bergantung 100% kepada sambungan internet atau cloud luaran.",
         "backend/database.py, backend/models.py",
         "Seni bina hibrid pintar: Menggunakan Supabase PostGIS secara cloud dan automatik fallback kepada SQLite Spatial Engine tempatan dengan auto-seeding.")
    ]

    for title, desc, files, logic in modules:
        add_h2(title)
        add_p(desc, bold_prefix="Tujuan & Fungsi: ")
        add_p(files, bold_prefix="Fail Terlibat: ")
        add_p(logic, bold_prefix="Logik & Pelaksanaan: ")

    # ==========================================
    # SECTION 4: ANATOMI KOD SUMBER
    # ==========================================
    add_h1("4. ANATOMI KOD SUMBER SETIAP FAIL (CODE DIRECTORY)")
    
    add_h2("Bahagian Backend (Python & API)")
    add_bullet("**backend/main.py:** Nadi enjin REST API FastAPI. Mengendalikan laluan CORS, memetakan routing statik frontend, membaca data hujan OpenWeather, mengira formula risiko banjir setiap zon, menguruskan panggilan SOS mangsa, dan autentikasi token keselamatan.")
    add_bullet("**backend/models.py:** Mentakrifkan skema pangkalan data menggunakan SQLAlchemy ORM dan GeoAlchemy2 (`Geometry('POINT', srid=4326)`). Mengandungi jadual `FloodZone`, `PPSLocation`, `RainfallHistory`, `SOSRequest`, dan `User`.")
    add_bullet("**backend/database.py:** Menyediakan sambungan DB (*SessionLocal*) dan mengandungi fungsi keselamatan *fallback* SQLite yang membolehkan fungsi spatial PostGIS dijalankan pada SQLite tempatan tanpa memerlukan PostgreSQL dipasang.")
    add_bullet("**extract_elevation.py:** Skrip saintifik untuk membaca fail VRT NASA SRTM dan mengekstrak ketinggian bumi setiap koordinat menggunakan pustaka `rasterio`.")

    add_h2("Bahagian Frontend (HTML, CSS, JavaScript)")
    add_bullet("**frontend/index.html:** Laman utama portal awam. Mengandungi bekas peta `#map`, gelangsar simulasi hujan, bar penapis zon `#zone-filter-bar`, widget cuaca, modal kecemasan SOS, dan *bottom sheet drawer* telefon pintar.")
    add_bullet("**frontend/js/script.js:** Nadi logik portal awam. Mengandungi 59 titik sempadan OSM rasmi, 436 koordinat laluan OSRM jalan raya sebenar, formula hingar FBM, logik interaktif penapis zon `focusZone`, dan pengendali panggilan API.")
    add_bullet("**frontend/css/style.css:** Tema reka bentuk *Glassmorphism Dark UI*, animasi denyutan garisan laluan (*neon dashFlow*), penggayaan kawalan lapisan peta Leaflet, dan reka bentuk responsif.")
    add_bullet("**frontend/responder.html & responder.js:** Portal khas Pasukan Bomba. Memaparkan peta insiden langsung, butang *Dispatch Unit*, pengurusan pemindahan mangsa, dan pemantauan peratusan kapasiti dewan PPS.")
    add_bullet("**frontend/admin.html & admin.js:** Papan pemuka pentadbir sistem untuk operasi pengurusan data zon, PPS, dan rekod sejarah hujan.")

    # ==========================================
    # SECTION 5: VIVA DEFENSE FAQ
    # ==========================================
    add_h1("5. PANDUAN MENJAWAB SOALAN PENILAIAN FYP (VIVA DEFENSE FAQ)")
    add_p("Bahagian ini menyediakan panduan jawapan mantap, padat, dan berfakta bagi menghadapi panel penilai FYP:")

    viva_qa = [
        ("Soalan 1: Adakah data ketinggian tanah (elevation) projek ini betul atau sekadar rekaan?",
         "Data elevasi ini adalah 100% data saintifik sebenar yang diekstrak daripada satelit NASA SRTM (Shuttle Radar Topography Mission) melalui dataset DIVA-GIS (MYS_alt.vrt). Melalui analisis piksel topografi menggunakan pustaka Python rasterio, kawasan Central Zone Taman Sri Muda terbukti mempunyai paras tanah serendah 8.7 meter dari aras laut, mengesahkan ia bertindak sebagai mangkuk tadahan (catchment basin) berbanding tebing Sungai Klang di paras 11.5–12.0 meter."),
         
        ("Soalan 2: Kenapa laluan pemindahan (evacuation route) nampak teratur mengikut lorong dan bukan garisan lurus?",
         "Kami mengintegrasikan data jaringan jalan raya sebenar melalui Open Source Routing Machine (OSRM). Laluan ini mengelakkan halangan padang, longkang besar, atau bangunan perumahan, serta mengarahkan penduduk melalui jalan utama seperti Jalan Persiaran Budiman dan Persiaran Tengku Ampuan terus ke 4 Pusat Pemindahan Sementara (PPS) yang diiktiraf."),
         
        ("Soalan 3: Apakah keunikan antaramuka FloodGuard berbanding portal banjir agensi kerajaan sedia ada?",
         "Portal sedia ada (seperti InfoBanjir JPS) kebanyakannya hanya memaparkan aras air di stesen siren sungai secara berangka. FloodGuard memperkenalkan simulasi kedalaman air visual terus di atas kediaman penduduk mengikut paras buku lali, lutut, pinggang, dan dada, lengkap dengan bar penapis zon interaktif (Zone Focus Bar) untuk mengasingkan laluan pemindahan agar mangsa tidak keliru semasa kecemasan."),
         
        ("Soalan 4: Bagaimana sistem mengendalikan masalah sekiranya pangkalan data cloud atau API cuaca terputus sambungan?",
         "Sistem dibina berasaskan Resilient Architecture. Sekiranya sambungan Supabase PostgreSQL terganggu, fail database.py secara automatik mengaktifkan pangkalan data SQLite spatial tempatan dengan fungsi spatial mock. Begitu juga dengan OpenWeatherMap di mana jika kuota API tamat, sistem beralih secara automatik kepada penjana cuaca sandaran tanpa menyebabkan pelayan terhenti (zero system crash).")
    ]

    for q, a in viva_qa:
        q_box = [f"Jawapan Mantap:\n\"{a}\""]
        add_callout(doc, q_box, q, border_color="059669", bg_color="F0FDF4")

    # Conclusion & Sign-off
    p_end = doc.add_paragraph()
    p_end.paragraph_format.space_before = Pt(20)
    p_end.paragraph_format.space_after = Pt(4)
    r_end = p_end.add_run("Dokumen ini disediakan khas dan disahkan untuk projek tahun akhir Muhammad Danial Hafiz (UniKL Software Engineering). Semua fail berkaitan dipelihara di dalam repositori https://github.com/danialhaff/floodguard.")
    r_end.font.size = Pt(9.5)
    r_end.italic = True
    r_end.font.color.rgb = RGBColor(100, 116, 139)

    out_path = "DOKUMENTASI_LENGKAP_FLOODGUARD.docx"
    doc.save(out_path)
    print(f"SUCCESS: Document saved to {out_path} (size: {os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    build_word_document()
