# Draws the simplified (not screenshot) figures of the GitHub and Google screens in the setup steps (README.md and
# public/setup.html). Run: python3 scripts/setup-figures.py public/setup   (Python 3, no packages needed)
import os, sys
from xml.sax.saxutils import escape

OUT = sys.argv[1]
FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"
INK, DIM, LINE, SOFT = "#1f2328", "#59636e", "#d0d7de", "#f6f8fa"
HL = "#d9480f"
GREEN, BLUE, GBLUE = "#1f883d", "#0969da", "#1a73e8"


def tw(s, size=13, mono=False):
    return len(s) * size * (0.6 if mono else 0.56)


class Fig:
    def __init__(self, w, h, name):
        self.w, self.h, self.name, self.p, self.badges = w, h, name, [], []

    def rect(self, x, y, w, h, fill="#fff", stroke=LINE, r=6, sw=1):
        self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def line(self, x1, y1, x2, y2, stroke=LINE, sw=1):
        self.p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"/>')

    def text(self, x, y, s, size=13, weight=400, fill=INK, anchor="start", mono=False, italic=False):
        st = (' font-style="italic"' if italic else "") + (' xml:space="preserve"' if mono else "")
        self.p.append(f'<text x="{x}" y="{y}" font-family="{MONO if mono else FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{st}>{escape(s)}</text>')

    def button(self, x, y, s, kind="default", size=13, h=30, w=None):
        w = w or tw(s, size) + 26
        fill, stroke, color = {"default": (SOFT, LINE, INK), "green": (GREEN, GREEN, "#fff"), "blue": (GBLUE, GBLUE, "#fff"),
                               "flat": ("#fff", "#fff", GBLUE)}[kind]
        self.rect(x, y, w, h, fill=fill, stroke=stroke, r=6)
        self.text(x + w / 2, y + h / 2 + size * 0.36, s, size=size, weight=600, fill=color, anchor="middle")
        return w

    def checkbox(self, x, y, on=True):
        if on:
            self.rect(x, y, 16, 16, fill=BLUE, stroke=BLUE, r=3)
            self.p.append(f'<path d="M{x+3.5} {y+8.5} l3 3 l6 -7" fill="none" stroke="#fff" stroke-width="2"/>')
        else:
            self.rect(x, y, 16, 16, fill="#fff", stroke="#8c959f", r=3)

    def radio(self, x, y, on):
        self.p.append(f'<circle cx="{x+8}" cy="{y+8}" r="7.5" fill="#fff" stroke="{BLUE if on else "#8c959f"}" stroke-width="{4.5 if on else 1}"/>')

    def hl(self, x, y, w, h, n, note=None, note_dx=10, note_side="right"):
        self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="none" stroke="{HL}" stroke-width="3"/>')
        self.badges.append((x, y, n))
        if note:
            if note_side == "right":
                self.text(x + w + note_dx, y + h / 2 + 4.5, note, size=12.5, weight=600, fill=HL)
            elif note_side == "below":
                self.text(x, y + h + 17, note, size=12.5, weight=600, fill=HL)
            elif note_side == "above":
                self.text(x, y - 9, note, size=12.5, weight=600, fill=HL)

    def pencil(self, x, y, color=INK):
        self.p.append(f'<path d="M{x+2} {y+14} l2 -5 l8 -8 l3 3 l-8 8 z M{x+10} {y+3} l3 3" fill="none" stroke="{color}" stroke-width="1.6" stroke-linejoin="round"/>')

    def gear(self, x, y, color=DIM):
        self.p.append(f'<circle cx="{x+8}" cy="{y+8}" r="5.5" fill="none" stroke="{color}" stroke-width="2.6" stroke-dasharray="2.6 1.7"/>'
                      f'<circle cx="{x+8}" cy="{y+8}" r="2" fill="{color}"/>')

    def floppy(self, x, y, color=DIM):
        self.p.append(f'<path d="M{x} {y} h11 l4 4 v11 h-15 z" fill="none" stroke="{color}" stroke-width="1.6" stroke-linejoin="round"/>'
                      f'<rect x="{x+3}" y="{y}" width="7" height="4.5" fill="none" stroke="{color}" stroke-width="1.4"/>'
                      f'<rect x="{x+3}" y="{y+8.5}" width="9" height="4.5" fill="none" stroke="{color}" stroke-width="1.4"/>')

    def save(self):
        body = "\n".join(self.p)
        badges = "".join(
            f'<circle cx="{x}" cy="{y}" r="11" fill="{HL}"/><text x="{x}" y="{y+4.5}" font-family="{FONT}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">{n}</text>'
            for x, y, n in self.badges)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" role="img" aria-label="{escape(self.name)}">\n'
               f'<rect x="0.5" y="0.5" width="{self.w-1}" height="{self.h-1}" rx="10" fill="#ffffff" stroke="{LINE}"/>\n'
               f'{body}\n{badges}\n'
               f'<text x="{self.w-12}" y="{self.h-9}" font-family="{FONT}" font-size="10.5" fill="#8c959f" text-anchor="end">Simplified drawing, not a screenshot</text>\n</svg>\n')
        return svg


figs = {}

# ---------------------------------------------------------------- GitHub: fork
f = Fig(720, 330, "GitHub: Create a new fork")
f.text(24, 40, "Create a new fork", 20, 600)
f.text(24, 62, "A fork is a copy of a repository.", 13, fill=DIM)
f.line(24, 76, 696, 76)
f.text(24, 102, "Owner *", 13, 600); f.rect(24, 110, 170, 32); f.text(36, 131, "your-name ▾")
f.text(204, 132, "/", 18, fill=DIM)
f.text(222, 102, "Repository name *", 13, 600); f.rect(222, 110, 240, 32); f.text(234, 131, "wi-climate-map")
f.hl(216, 104, 252, 44, 1, "any name, e.g. wi-climate-map")
f.text(24, 172, "Description (optional)", 13, 600); f.rect(24, 180, 438, 32)
f.checkbox(28, 234); f.text(52, 247, "Copy the main branch only", 13, 600)
f.text(52, 265, "Contribute back to … by adding your own branch.", 12, fill=DIM)
f.hl(20, 226, 340, 48, 2, "leave this ticked")
w = f.button(24, 284, "Create fork", "green")
f.hl(18, 278, w + 12, 42, 3)
figs["fork.svg"] = f

# ---------------------------------------------------------------- GitHub: enable Actions
f = Fig(720, 230, "GitHub: enable Actions in the fork")
x = 24
for i, tab in enumerate(["<> Code", "Issues", "Pull requests", "Actions", "Projects", "Security", "Insights", "Settings"]):
    if tab == "Actions":
        f.text(x, 36, tab, 14, 600); f.line(x - 6, 50, x + tw(tab, 14) + 6, 50, stroke="#fd8c73", sw=2.5)
        f.hl(x - 10, 18, tw(tab, 14) + 20, 30, 1)
    elif tab == "Settings":
        f.gear(x, 24); f.text(x + 20, 36, tab, 14); x += 20
    else:
        f.text(x, 36, tab, 14, fill=INK)
    x += tw(tab, 14) + 22
f.line(0, 51, 720, 51)
f.rect(24, 72, 672, 124, fill=SOFT)
f.text(48, 104, "Workflows aren’t being run on this forked repository", 16, 600)
f.text(48, 128, "Because this repository contained workflow files when it was forked, we have disabled them…", 12.5, fill=DIM)
w = f.button(48, 148, "I understand my workflows, go ahead and enable them", "green")
f.hl(42, 142, w + 12, 42, 2)
figs["actions.svg"] = f

# ---------------------------------------------------------------- GitHub: Settings → Pages
f = Fig(720, 320, "GitHub: Settings, Pages, Source: GitHub Actions")
f.text(24, 36, "<> Code    Issues    Pull requests    Actions    …", 14, fill=DIM)
f.gear(500, 24, INK); f.text(520, 36, "Settings", 14, 600)
f.hl(494, 18, 96, 30, 1)
f.line(0, 51, 720, 51)
y = 84
for item in ["General", "Collaborators", None, "Branches", "Actions", "Environments", "Pages"]:
    if item is None:
        f.text(24, y, "Code and automation", 11.5, 600, fill=DIM); y += 26; continue
    if item == "Pages":
        f.rect(18, y - 18, 170, 28, fill="#eaeef2", stroke="#eaeef2", r=6)
        f.text(30, y, item, 13.5, 600)
        f.hl(14, y - 22, 178, 36, 2)
    else:
        f.text(30, y, item, 13.5)
    y += 30
f.line(208, 64, 208, 300)
f.text(232, 90, "GitHub Pages", 20, 600)
f.text(232, 128, "Build and deployment", 15, 600)
f.text(232, 156, "Source", 13, 600)
f.rect(232, 166, 200, 32, fill=SOFT); f.text(244, 187, "GitHub Actions  ▾", 13, 600)
f.hl(226, 163, 212, 38, 3, "choose GitHub Actions (it starts as “Deploy from a branch”)", note_side="below")
f.rect(232, 236, 300, 64, fill="#fff"); f.text(244, 260, "Deploy from a branch", 13, fill=DIM); f.text(244, 286, "GitHub Actions   ✓", 13, 600)
figs["pages.svg"] = f

# ---------------------------------------------------------------- GitHub: site is live
f = Fig(720, 170, "GitHub: Settings, Pages, Your site is live")
f.text(24, 40, "GitHub Pages", 20, 600)
f.rect(24, 58, 672, 56, fill="#dafbe1", stroke="#aceebb")
f.text(42, 92, "Your site is live at https://your-name.github.io/wi-climate-map/", 13.5, 600)
w = f.button(560, 71, "↗ Visit site", "default")
f.hl(554, 65, w + 12, 42, 1)
f.text(24, 142, "Then add  setup.html  to the end of the address: …/wi-climate-map/setup.html", 13, fill=HL, weight=600)
figs["site-live.svg"] = f

# ---------------------------------------------------------------- GitHub: edit a file (pencil)
f = Fig(720, 250, "GitHub: the pencil icon edits a file")
f.text(24, 38, "wi-climate-map / map.config.ts", 16, 600)
f.rect(24, 56, 672, 170, fill="#fff")
f.rect(24, 56, 672, 42, fill=SOFT, r=6)
f.text(40, 82, "Code    Blame    27 lines · 1.3 KB", 13, fill=DIM)
x = 470
for lab in ["Raw", "⧉", "⤓"]:
    x += f.button(x, 62, lab, "default", h=30, w=(52 if lab == "Raw" else 34)) + 6
f.rect(x + 4, 62, 50, 30, fill="#fff"); f.pencil(x + 12, 69); f.text(x + 38, 82, "▾", 11, fill=DIM)
f.hl(x - 2, 56, 62, 42, 1, "Edit this file", note_side="above")
for i, ln in enumerate(['export default {', '  title: "Your State Climate Organization Map",', '  state: "",', '  landAcknowledgement: `', '[Write your land acknowledgement here …]']):
    f.text(40, 124 + i * 20, f"{i+6:>2}", 12, fill="#8c959f", mono=True)
    f.text(70, 124 + i * 20, ln, 12.5, mono=True)
figs["edit.svg"] = f

# ---------------------------------------------------------------- GitHub: commit dialog
f = Fig(720, 360, "GitHub: Commit changes, directly to the main branch")
f.text(24, 38, "wi-climate-map / map.config.ts", 15, 600); f.text(262, 38, "in", 13, fill=DIM); f.rect(282, 22, 52, 24, fill=SOFT); f.text(294, 39, "main", 12.5, mono=True)
w1 = f.button(430, 18, "Cancel changes", "default")
w = f.button(430 + w1 + 8, 18, "Commit changes…", "green")
f.hl(430 + w1 + 2, 12, w + 12, 42, 1)
f.rect(130, 72, 480, 268, fill="#fff", stroke="#8c959f", r=10)
f.text(152, 104, "Commit changes", 17, 600); f.text(588, 104, "×", 18, fill=DIM, anchor="end")
f.text(152, 136, "Commit message", 13, 600); f.rect(152, 144, 436, 30); f.text(162, 164, "Update map.config.ts", 13)
f.text(152, 196, "Extended description", 13, 600, fill=DIM); f.rect(152, 204, 436, 26)
f.radio(156, 244, True); f.text(182, 257, "Commit directly to the main branch", 13, 600)
f.hl(148, 236, 290, 32, 2, "this one")
f.radio(156, 276, False); f.text(182, 289, "Create a new branch for this commit and start a pull request", 12.5, fill=DIM)
f.button(398, 302, "Cancel", "default")
w = f.button(470, 302, "Commit changes", "green")
f.hl(464, 296, w + 12, 42, 3)
figs["commit.svg"] = f

# ---------------------------------------------------------------- Google Sheets: Extensions → Apps Script
MENU = ["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Extensions", "Help"]


def sheet_header(f, extra=None):
    f.rect(20, 18, 22, 28, fill="#188038", stroke="#188038", r=3)
    for k in range(3):
        f.line(24, 28 + k * 6, 38, 28 + k * 6, stroke="#fff", sw=1.5)
    f.text(54, 36, "WI Climate Organization Map data", 16)
    x, pos = 54, {}
    for m in MENU + ([extra] if extra else []):
        pos[m] = x
        f.text(x, 66, m, 13.5)
        x += tw(m, 13.5) + 16
    f.line(0, 80, f.w, 80)
    for k in range(6):
        f.line(20, 104 + k * 26, f.w - 20, 104 + k * 26, stroke="#eceff1")
    return pos


f = Fig(720, 280, "Google Sheets: Extensions, Apps Script")
pos = sheet_header(f)
ex = pos["Extensions"]
f.hl(ex - 8, 48, tw("Extensions", 13.5) + 16, 28, 1)
f.rect(ex - 6, 84, 220, 118, fill="#fff", stroke="#c4c7c5", r=6)
f.text(ex + 12, 112, "Add-ons", 13.5); f.text(ex + 196, 112, "›", 14, fill=DIM, anchor="end")
f.text(ex + 12, 142, "Macros", 13.5); f.text(ex + 196, 142, "›", 14, fill=DIM, anchor="end")
f.text(ex + 12, 178, "Apps Script", 13.5, 600)
f.hl(ex, 158, 208, 32, 2, "opens in a new tab", note_side="below")
figs["extensions.svg"] = f

# ---------------------------------------------------------------- Apps Script editor
f = Fig(720, 320, "Apps Script editor: paste over Code.gs, then Save")
f.text(20, 34, "Apps Script", 16, 600); f.text(130, 34, "Untitled project", 16, fill=DIM)
w = f.button(600, 14, "Deploy ▾", "blue")
f.text(596, 60, "(step 9)", 11.5, fill=DIM)
f.line(0, 70, 720, 70)
for k in range(5):
    f.rect(14, 88 + k * 34, 16, 16, fill="#e8eaed", stroke="#e8eaed", r=3)
f.line(44, 70, 44, 300)
f.text(56, 96, "Files", 13, 600); f.text(176, 96, "+", 15, fill=DIM)
f.rect(50, 108, 150, 28, fill="#e8f0fe", stroke="#e8f0fe", r=14); f.text(64, 127, "Code.gs", 13, 600)
f.line(208, 70, 208, 300)
f.text(222, 98, "↶  ↷", 15, fill=DIM)
f.floppy(270, 85, INK)
f.hl(262, 78, 32, 30, 2, "Save")
f.text(336, 98, "▷ Run    Debug    myFunction ▾    Execution log", 13, fill=DIM)
f.line(208, 116, 720, 116)
for i, ln in enumerate(["function myFunction() {", "", "}"]):
    f.text(224, 144 + i * 22, str(i + 1), 12.5, fill="#8c959f", mono=True)
    f.text(252, 144 + i * 22, ln, 13, mono=True)
f.hl(244, 126, 440, 76, 1)
f.text(252, 228, "Click in the code, select all (Ctrl+A, Mac ⌘A), then paste (Ctrl+V, Mac ⌘V).", 12.5, 600, fill=HL)
f.text(252, 248, "It's long: the paste takes a few seconds.", 12, fill=DIM)
figs["editor.svg"] = f

# ---------------------------------------------------------------- Sheets: the map's menu
f = Fig(800, 300, "Google Sheets: the map's own menu, Set up sheet + forms")
pos = sheet_header(f, "Climate Organization Map")
cm = pos["Climate Organization Map"]
f.hl(cm - 8, 48, tw("Climate Organization Map", 13.5) + 16, 28, 1)
mx = 380
f.rect(mx, 84, 400, 196, fill="#fff", stroke="#c4c7c5", r=6)
items = ["Set up sheet + forms (run once)", "Connect to the map's website (name, state)", "Replace projects, events and actions from the repo",
         "Refresh form dropdowns", "Switch forms to typed answers (orgs + topics)", "…"]
for i, it in enumerate(items):
    f.text(mx + 16, 112 + i * 30, it, 13.5, 600 if i == 0 else 400, fill=INK if i == 0 else DIM)
f.hl(mx + 6, 92, 250, 30, 2)
f.text(24, 290 - 12, "", 12)
figs["menu.svg"] = f

# ---------------------------------------------------------------- Google permissions
f = Fig(780, 330, "Google: allow the script (OK, Advanced, Go to …, Select all, Continue)")
# a
f.rect(16, 16, 236, 290, fill="#fff", stroke="#c4c7c5", r=10)
f.text(32, 48, "Authorization required", 15, 600)
for i, ln in enumerate(["A script attached to this", "document needs your", "permission to run."]):
    f.text(32, 78 + i * 20, ln, 12.5, fill=DIM)
f.button(80, 250, "Cancel", "flat")
w = f.button(170, 250, "OK", "blue", w=58)
f.hl(164, 244, 70, 42, 1)
# b
bx = 272
f.rect(bx, 16, 236, 290, fill="#fff", stroke="#c4c7c5", r=10)
f.text(bx + 16, 48, "Google hasn’t verified", 15, 600); f.text(bx + 16, 68, "this app", 15, 600)
for i, ln in enumerate(["The app is requesting access", "to sensitive info in your", "Google Account…"]):
    f.text(bx + 16, 96 + i * 18, ln, 12, fill=DIM)
f.text(bx + 16, 172, "Advanced", 12.5, 600, fill=GBLUE)
f.hl(bx + 8, 154, 80, 26, 2)
f.button(bx + 112, 156, "BACK TO SAFETY", "blue", size=11, h=26)
f.line(bx + 12, 196, bx + 224, 196, stroke="#eceff1")
f.text(bx + 16, 220, "Continue only if you trust", 12, fill=DIM); f.text(bx + 16, 236, "the developer.", 12, fill=DIM)
f.text(bx + 16, 266, "Go to Untitled project (unsafe)", 12.5, 600, fill=GBLUE)
f.hl(bx + 8, 248, 214, 26, 3)
# c
cx = 528
f.rect(cx, 16, 236, 290, fill="#fff", stroke="#c4c7c5", r=10)
f.text(cx + 16, 48, "Untitled project wants", 15, 600); f.text(cx + 16, 68, "access to your Google", 15, 600); f.text(cx + 16, 88, "Account", 15, 600)
f.text(cx + 16, 114, "Select what it can access", 12, fill=DIM)
f.checkbox(cx + 16, 128); f.text(cx + 40, 141, "Select all", 13, 600)
f.hl(cx + 8, 120, 110, 32, 4)
for i, ln in enumerate(["Google Sheets", "Google Forms", "Send email as you", "Connect to external service"]):
    f.checkbox(cx + 16, 164 + i * 22); f.text(cx + 40, 177 + i * 22, ln, 12, fill=DIM)
f.button(cx + 70, 262, "Cancel", "flat")
w = f.button(cx + 150, 262, "Continue", "blue")
f.hl(cx + 144, 256, w + 12, 42, 5)
figs["permissions.svg"] = f

# ---------------------------------------------------------------- Apps Script: Deploy → New deployment → Web app
f = Fig(780, 340, "Apps Script: Deploy, New deployment, gear, Web app")
w = f.button(24, 22, "Deploy ▾", "blue")
f.hl(18, 16, w + 12, 42, 1)
f.rect(24, 62, 180, 100, fill="#fff", stroke="#c4c7c5", r=6)
f.text(38, 88, "New deployment", 13.5, 600); f.text(38, 116, "Manage deployments", 13.5, fill=DIM); f.text(38, 144, "Test deployments", 13.5, fill=DIM)
f.hl(30, 70, 140, 26, 2)
dx = 228
f.rect(dx, 16, 536, 302, fill="#fff", stroke="#8c959f", r=10)
f.text(dx + 20, 46, "New deployment", 17, 600)
f.text(dx + 20, 82, "Select type", 13.5, 600); f.gear(dx + 104, 70, INK)
f.hl(dx + 96, 64, 32, 32, 3, "click the gear", note_dx=8)
f.rect(dx + 20, 104, 170, 116, fill="#fff", stroke="#c4c7c5", r=6)
for i, it in enumerate(["Web app", "API Executable", "Add-on", "Library"]):
    f.text(dx + 34, 128 + i * 26, it, 13, 600 if i == 0 else 400, fill=INK if i == 0 else DIM)
f.hl(dx + 26, 110, 110, 26, 4)
f.line(dx + 206, 64, dx + 206, 300, stroke="#eceff1")
rx = dx + 222
f.text(rx, 82, "Configuration", 13.5, 600)
f.text(rx, 108, "Description", 12, fill=DIM); f.rect(rx, 114, 290, 26)
f.text(rx, 164, "Web app", 13, 600)
f.text(rx, 186, "Execute as", 12, fill=DIM); f.rect(rx, 192, 290, 28); f.text(rx + 10, 211, "Me (you@gmail.com)  ▾", 12.5)
f.hl(rx - 6, 189, 302, 34, 5)
f.text(rx, 240, "Who has access", 12, fill=DIM); f.rect(rx, 246, 290, 28); f.text(rx + 10, 265, "Anyone  ▾", 12.5, 600)
f.hl(rx - 6, 243, 302, 34, 6)
f.button(rx + 150, 284, "Cancel", "flat", h=26)
w = f.button(rx + 222, 284, "Deploy", "blue", h=26)
f.hl(rx + 216, 278, w + 12, 38, 7)
figs["deploy.svg"] = f

# ---------------------------------------------------------------- Apps Script: copy the web app URL
f = Fig(720, 210, "Apps Script: copy the Web app URL")
f.text(24, 44, "New deployment", 17, 600)
f.text(24, 76, "Deployment successfully created.", 13.5, fill=GREEN, weight=600)
f.text(24, 108, "Web app", 13, 600)
f.text(24, 132, "URL", 12, fill=DIM)
f.rect(24, 140, 520, 30, fill=SOFT); f.text(34, 160, "https://script.google.com/macros/s/AKfy…/exec", 12.5, mono=True)
w = f.button(556, 140, "⧉ Copy", "flat")
f.hl(550, 134, w + 12, 42, 1)
f.button(640, 140, "Done", "blue", w=60)
f.text(24, 194, "Paste this into map.config.ts as dataUrl.", 12.5, 600, fill=HL)
figs["deploy-url.svg"] = f

os.makedirs(OUT, exist_ok=True)
for name, fig in figs.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(fig.save())
print("wrote", len(figs), "figures:", ", ".join(figs))
