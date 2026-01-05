from crawler.ai.client import summarize_text


def summarize_content(content):
    summary = summarize_text(content, style="concise")
    return summary or ""
