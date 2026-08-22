from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "resume"
OUT.mkdir(parents=True, exist_ok=True)

FONT_DIR = Path(os.environ["WINDIR"]) / "Fonts"
pdfmetrics.registerFont(TTFont("ResumeSans", str(FONT_DIR / "msyh.ttc"), subfontIndex=0))
pdfmetrics.registerFont(TTFont("ResumeSansBold", str(FONT_DIR / "msyhbd.ttc"), subfontIndex=0))

PAPER = HexColor("#F7FAFF")
BLUE = HexColor("#245BFF")
CYAN = HexColor("#85D7FF")
INK = HexColor("#0B1F42")
MUTED = HexColor("#526783")
LINE = HexColor("#C9D8F5")


def wrap(text: str, font: str, size: float, width: float, language: str) -> list[str]:
    if language == "en":
        tokens = text.split()
        lines: list[str] = []
        current = ""
        for token in tokens:
            candidate = f"{current} {token}".strip()
            if current and pdfmetrics.stringWidth(candidate, font, size) > width:
                lines.append(current)
                current = token
            else:
                current = candidate
        if current:
            lines.append(current)
        return lines

    lines = []
    current = ""
    for char in text:
        candidate = current + char
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = char
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c: canvas.Canvas, text: str, x: float, y: float, width: float, *, language: str, font: str = "ResumeSans", size: float = 8.2, leading: float = 12, color=INK, bullet: bool = False) -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    indent = 10 if bullet else 0
    lines = wrap(text, font, size, width - indent, language)
    for index, line in enumerate(lines):
        if bullet and index == 0:
            c.setFillColor(BLUE)
            c.circle(x + 2, y + 3, 1.6, fill=1, stroke=0)
            c.setFillColor(color)
        c.drawString(x + indent, y, line)
        y -= leading
    return y


def section_label(c: canvas.Canvas, label: str, x: float, y: float, width: float) -> float:
    c.setFillColor(BLUE)
    c.setFont("ResumeSansBold", 8.4)
    c.drawString(x, y, label.upper())
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(x, y - 5, x + width, y - 5)
    return y - 18


def draw_pill(c: canvas.Canvas, text: str, x: float, y: float, max_width: float) -> float:
    width = min(max_width, pdfmetrics.stringWidth(text, "ResumeSans", 7.2) + 14)
    c.setFillColor(HexColor("#EAF1FF"))
    c.roundRect(x, y - 9, width, 15, 7.5, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("ResumeSans", 7.2)
    c.drawString(x + 7, y - 4.5, text)
    return width


def timeline_item(c: canvas.Canvas, date: str, title: str, subtitle: str, bullets: Iterable[str], x: float, y: float, width: float, language: str) -> float:
    c.setFillColor(BLUE)
    c.circle(x + 3, y + 2, 3, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(x + 3, y - 2, x + 3, y - 108)
    c.setFillColor(MUTED)
    c.setFont("ResumeSans", 7.3)
    c.drawRightString(x + width, y + 1, date)
    c.setFillColor(INK)
    c.setFont("ResumeSansBold", 10.2)
    c.drawString(x + 14, y, title)
    y -= 15
    c.setFillColor(BLUE)
    c.setFont("ResumeSans", 7.8)
    c.drawString(x + 14, y, subtitle)
    y -= 15
    for bullet in bullets:
        y = draw_wrapped(c, bullet, x + 14, y, width - 14, language=language, size=7.5, leading=10.7, bullet=True)
        y -= 2
    return y - 8


def build(language: str, output: Path) -> None:
    zh = language == "zh"
    c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    c.setTitle("lenggujian - 脱敏简历" if zh else "lenggujian - Sanitized Resume")
    c.setAuthor("lenggujian")
    width, height = A4
    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    sidebar = 178
    c.setFillColor(INK)
    c.rect(0, 0, sidebar, height, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.circle(42, height - 48, 8, fill=1, stroke=0)
    c.setStrokeColor(CYAN)
    c.setLineWidth(2)
    c.arc(28, height - 68, 72, height - 28, 200, 235)

    sx, sy, sw = 28, height - 90, sidebar - 52
    c.setFillColor(white)
    c.setFont("ResumeSansBold", 20)
    c.drawString(sx, sy, "lenggujian")
    sy -= 21
    c.setFillColor(CYAN)
    c.setFont("ResumeSans", 8.2)
    c.drawString(sx, sy, "AI FULL-STACK / AGENT ENGINEER")
    sy -= 32

    c.setFillColor(white)
    c.setFont("ResumeSansBold", 9)
    c.drawString(sx, sy, "CONTACT" if not zh else "联系方式")
    sy -= 17
    for line in ["gujianleng@gmail.com", "github.com/anonkuki", "Beijing · 2027 Graduate" if not zh else "北京 · 2027 届本科"]:
        c.setFont("ResumeSans", 7.8)
        c.setFillColor(HexColor("#DCE7FF"))
        c.drawString(sx, sy, line)
        sy -= 14
    sy -= 18

    c.setFillColor(white)
    c.setFont("ResumeSansBold", 9)
    c.drawString(sx, sy, "EDUCATION" if not zh else "教育背景")
    sy -= 18
    c.setFont("ResumeSansBold", 9.2)
    c.drawString(sx, sy, "Beijing Jiaotong University" if not zh else "北京交通大学")
    sy -= 14
    c.setFont("ResumeSans", 7.6)
    education = "B.Eng. in Artificial Intelligence\nSchool of Computer Science\n2023.09 — 2027.06" if not zh else "人工智能专业 · 本科\n计算机科学与技术学院\n2023.09 — 2027.06"
    for line in education.split("\n"):
        c.setFillColor(HexColor("#DCE7FF"))
        c.drawString(sx, sy, line)
        sy -= 13
    sy -= 18

    c.setFillColor(white)
    c.setFont("ResumeSansBold", 9)
    c.drawString(sx, sy, "AWARDS" if not zh else "奖项")
    sy -= 17
    awards = [
        "Beijing 1st Prize · OPC Innovation" if not zh else "京彩大创 OPC 大赛 · 北京市一等奖",
        "Beijing 3rd Prize · Computer Design" if not zh else "计算机设计大赛 · 北京市三等奖",
    ]
    for award in awards:
        sy = draw_wrapped(c, award, sx, sy, sw, language=language, size=7.4, leading=11, color=HexColor("#DCE7FF"), bullet=True)
        sy -= 4
    sy -= 15

    c.setFillColor(white)
    c.setFont("ResumeSansBold", 9)
    c.drawString(sx, sy, "CORE STACK" if not zh else "核心技术")
    sy -= 18
    stack = ["Python · FastAPI", "LangGraph · RAG", "React · TypeScript", "Vue 3 · Playwright", "SQLite · ChromaDB", "DOCX · Excel · PDF", "Android · Offline"]
    for item in stack:
        c.setFillColor(HexColor("#DCE7FF"))
        c.setFont("ResumeSans", 7.6)
        c.drawString(sx, sy, item)
        sy -= 14

    x, y, main_width = sidebar + 28, height - 48, width - sidebar - 56
    c.setFillColor(BLUE)
    c.setFont("ResumeSansBold", 7.8)
    c.drawString(x, y, "AI FULL-STACK · AGENT HARNESS · DOCUMENT INTELLIGENCE")
    y -= 26
    c.setFillColor(INK)
    c.setFont("ResumeSansBold", 17 if zh else 15)
    headline = "把复杂行业流程，做成可执行、可追溯、可交付的 AI 系统。" if zh else "Turning complex domain workflows into traceable, shippable AI systems."
    for line in wrap(headline, "ResumeSansBold", 17 if zh else 15, main_width, language):
        c.drawString(x, y, line)
        y -= 22
    y -= 4
    intro = "冷家健，专注 Agent Harness、智能文档与真实业务系统。擅长把模型能力放进确定性工程边界，以状态、规则、证据和人工确认控制复杂任务。" if zh else "AI full-stack engineer focused on Agent harnesses, intelligent documents, and production-minded business systems—constraining model uncertainty with state, rules, evidence, and human checkpoints."
    y = draw_wrapped(c, intro, x, y, main_width, language=language, size=8.2, leading=12, color=MUTED)
    y -= 13

    y = section_label(c, "实习经历" if zh else "Experience", x, y, main_width)
    if zh:
        y = timeline_item(c, "2026.07 — 至今", "北京科兴 · AI 全栈应用开发实习", "受监管报告智能体", [
            "参与设计并独立开发 Excel 数据解析、确定性预检、Word 模板组装、规则审核与来源追溯流程。",
            "以规则引擎约束事实与结构，让模型在证据边界内生成和辅助审核；参与联调、回归与验收。",
        ], x, y, main_width, language)
        y = timeline_item(c, "2026.03 — 06", "北京清研灵智 · AI 全栈开发实习", "投标文档 Agent Harness", [
            "负责解析、结构化、RAG、章节/图表生成、审查重写与 DOCX 交付的端到端执行链。",
            "基于 LangGraph 构建状态编排、review-rewrite、任务恢复与人机确认，并持续交付多类业务原型。",
        ], x, y, main_width, language)
    else:
        y = timeline_item(c, "2026.07 — Present", "Sinovac · AI Full-stack Engineering Intern", "Regulated Report Agent", [
            "Built Excel ingestion, deterministic prechecks, Word template assembly, rule-based review, and source lineage.",
            "Constrained generation with business rules and evidence boundaries; contributed to integration, regression, and delivery acceptance.",
        ], x, y, main_width, language)
        y = timeline_item(c, "2026.03 — 06", "Qingyan Lingzhi · AI Full-stack Engineering Intern", "Tender Document Agent Harness", [
            "Led an end-to-end workflow spanning parsing, requirement structuring, RAG, section and diagram generation, review, and DOCX delivery.",
            "Built LangGraph state orchestration, review-rewrite loops, task recovery, and human checkpoints; shipped multiple business prototypes.",
        ], x, y, main_width, language)

    y = section_label(c, "代表工程能力" if zh else "Selected Engineering", x, y, main_width)
    selected = [
        ("Agent 编排" if zh else "Agent orchestration", "状态图、工具层、缓存失效、任务恢复、HITL" if zh else "State graphs, tool adapters, cache invalidation, recovery, HITL"),
        ("文档与证据" if zh else "Documents & evidence", "Excel/PDF/DOCX、模板合同、规则审核、来源定位" if zh else "Excel/PDF/DOCX, template contracts, rules, provenance"),
        ("交付与验证" if zh else "Delivery & verification", "前后端联调、自动化测试、浏览器验收、离线交付" if zh else "Full-stack integration, automated QA, browser acceptance, offline delivery"),
    ]
    for title, detail in selected:
        c.setFont("ResumeSansBold", 8.3)
        c.setFillColor(INK)
        c.drawString(x, y, title)
        y -= 12
        y = draw_wrapped(c, detail, x + 12, y, main_width - 12, language=language, size=7.5, leading=10, color=MUTED)
        y -= 6

    c.setFillColor(BLUE)
    c.roundRect(x, 28, main_width, 27, 8, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("ResumeSansBold", 8.1)
    footer = "作品集：anonkuki.github.io  ·  GitHub：github.com/anonkuki" if zh else "Portfolio: anonkuki.github.io  ·  GitHub: github.com/anonkuki"
    c.drawCentredString(x + main_width / 2, 38, footer)
    c.save()


build("zh", OUT / "lenggujian-resume-zh.pdf")
build("en", OUT / "lenggujian-resume-en.pdf")
print("Generated 2 sanitized A4 resumes without phone number or portrait.")
