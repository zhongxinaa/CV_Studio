from flask import Blueprint, redirect, render_template, url_for

from schemas import COVER_LETTER_TONES, EXPERIENCE_LEVELS

pages_bp = Blueprint("pages", __name__)


@pages_bp.route("/")
def home():
    return redirect(url_for("pages.cover_letter"))


@pages_bp.route("/builder")
def builder():
    return render_template("builder.html")


@pages_bp.route("/cover-letter")
def cover_letter():
    return render_template("cover_letter.html", tones=COVER_LETTER_TONES)


@pages_bp.route("/resume-generator")
def resume_generator():
    return render_template("resume_generator.html", experience_levels=EXPERIENCE_LEVELS)


@pages_bp.route("/templates")
def templates_gallery():
    return render_template("templates_gallery.html")
