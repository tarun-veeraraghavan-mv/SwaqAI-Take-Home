import subprocess
import os
import re

def clean_webvtt(vtt_text: str) -> str:
    # Remove WEBVTT headers and cue settings like "Kind: captions" and "align:start"
    vtt_text = re.sub(r"(?i)(WEBVTT|Kind:.*|Language:.*)", "", vtt_text)

    # Remove timestamps like "00:00:00.000 --> 00:00:02.000"
    vtt_text = re.sub(r"\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}.*", "", vtt_text)

    # Remove alignment tags
    vtt_text = re.sub(r"align:start.*", "", vtt_text)
    vtt_text = re.sub(r"position:\d+%.*", "", vtt_text)

    # Remove empty lines and strip
    lines = vtt_text.split("\n")
    text_lines = [line.strip() for line in lines if line.strip() and not line.strip().isdigit()]

    # Deduplicate exact lines (YouTube often has 3x repeated lines for slow captions)
    deduped = []
    last_line = None
    for line in text_lines:
        if line != last_line:
            deduped.append(line)
        last_line = line

    return " ".join(deduped).strip()

def get_transcript_from_ytdlp(video_id):
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    output_dir = "/tmp/yt_transcripts"
    os.makedirs(output_dir, exist_ok=True)

    command = [
        "yt-dlp",
        "--write-auto-sub",
        "--sub-lang", "en",
        "--skip-download",
        "--output", f"{output_dir}/%(id)s.%(ext)s",
        video_url
    ]

    try:
        subprocess.run(command, check=True)

        vtt_file = f"{output_dir}/{video_id}.en.vtt"
        if not os.path.exists(vtt_file):
            return {"error": "Transcript file not found (maybe subtitles disabled?)"}

        with open(vtt_file, "r", encoding="utf-8") as f:
            raw_vtt = f.read()

        clean_text = clean_webvtt(raw_vtt)

        return {
            "video_id": video_id,
            "transcript": clean_text
        }

    except subprocess.CalledProcessError as e:
        return {"error": f"yt-dlp failed: {str(e)}"}
    except Exception as e:
        return {"error": str(e)}