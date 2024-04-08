from PIL import Image
import requests
from torchvision import models, transforms

# Load a pretrained image classification model
model = models.resnet50(pretrained=True)
model.eval()

# Define image transformations
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def classify_image(image_url):
    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            outputs = model(tensor)
            _, predicted = torch.max(outputs, 1)

        # Translate predicted category index to a label here
        return predicted.item()
    except Exception as e:
        raise e

def analyze_image(image_url):
    try:
        return classify_image(image_url)
    except Exception as e:
        raise e