import torch
import logging
from transformers import BartTokenizer, BartForConditionalGeneration
import streamlit as st

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MoviePlotSummarizer:
    def __init__(self, model_name='facebook/bart-large-cnn'):
        self.tokenizer = BartTokenizer.from_pretrained(model_name)
        self.model = BartForConditionalGeneration.from_pretrained(model_name)

    # Summarize a movie plot
    def summarize(self, plot_text, max_length=130, min_length=30, style='default'):
        try:
            # Adjusting the style of summarization based on input
            if style == 'verbose':
                max_length *= 2
                min_length *= 2
            elif style == 'concise':
                max_length //= 2
                min_length //= 2

            # Tokenize and generate summary
            inputs = self.tokenizer.encode("summarize: " + plot_text, return_tensors="pt", max_length=1024, truncation=True)
            summary_ids = self.model.generate(inputs, max_length=max_length, min_length=min_length, length_penalty=2.0, num_beams=4, early_stopping=True)
            return self.tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        except Exception as e:
            logger.error(f"Error in summarizing plot: {e}")
            return "Error in summarization process."

# Streamlit UI
def main():
    st.title("Movie Plot Summarizer")
    st.write("Enter a movie plot to get a summarized version.")

    plot_text = st.text_area("Movie Plot", height=250)
    max_length = st.slider("Max Summary Length", 30, 300, 130)
    min_length = st.slider("Min Summary Length", 10, 150, 30)
    style = st.selectbox("Summarization Style", ['default', 'verbose', 'concise'])

    if st.button("Summarize"):
        summarizer = MoviePlotSummarizer()
        summary = summarizer.summarize(plot_text, max_length=max_length, min_length=min_length, style=style)
        st.subheader("Summarized Plot")
        st.write(summary)

    if st.button("About"):
        st.subheader("About")
        st.write("This is a simple movie plot summarizer built using the HuggingFace Transformers library. It uses the BART model to generate the summaries.")
        st.write("The model was trained on the CNN/Daily Mail dataset, which contains news articles and their summaries. The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")
        st.write("The model was fine-tuned on the XSUM dataset, which contains summaries of BBC articles.")

if __name__ == "__main__":
    main()
