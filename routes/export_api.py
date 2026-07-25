from flask import Blueprint, jsonify, request, send_file

from services.export.resume_docx import build_resume_docx

export_bp = Blueprint("export_api", __name__)


@export_bp.route("/api/export/docx", methods=["POST"])
def export_docx():
    body = request.get_json(silent=True)
    if body is None or "resume" not in body:
        return jsonify(error="Request body must include a resume object."), 400

    resume = body["resume"]
    buffer = build_resume_docx(resume)
    full_name = (resume.get("personalInfo") or {}).get("fullName") or "resume"
    filename = f"{full_name}-resume.docx"

    return send_file(
        buffer,
        as_attachment=True,
        download_name=filename,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
