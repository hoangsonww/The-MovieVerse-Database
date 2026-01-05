from django import forms


class ReviewForm(forms.Form):
    rating = forms.FloatField(min_value=0, max_value=5)
    review_text = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"placeholder": "Your comment"}),
    )
