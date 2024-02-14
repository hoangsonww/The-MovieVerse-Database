from transformers import pipeline

summarizer = pipeline("summarization")

def summarize_content(content):
    """
    Summarize the content using a pre-trained summarization model.

    :param content: String containing the content to summarize.
    :return: Summarized content.
    """
    summary = summarizer(content, max_length=50, min_length=25, do_sample=False)
    return summary[0]['summary_text']
