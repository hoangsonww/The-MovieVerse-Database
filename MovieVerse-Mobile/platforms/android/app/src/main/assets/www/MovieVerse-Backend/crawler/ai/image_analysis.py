from crawler.ai.client import classify_image


def analyze_image(image_url):
    labels = classify_image(image_url)
    return labels or []
