#include <stdio.h>
#include <stdlib.h>

// Function to resize an image
void resizeImage(unsigned char* imageData, int originalWidth, int originalHeight, int targetWidth, int targetHeight) {
    float widthScale = (float) targetWidth / originalWidth;
    float heightScale = (float) targetHeight / originalHeight;

    unsigned char* resizedImageData = (unsigned char*) malloc(targetWidth * targetHeight * sizeof(unsigned char));

    for (int y = 0; y < targetHeight; y++) {
        for (int x = 0; x < targetWidth; x++) {
            int originalX = (int)(x / widthScale);
            int originalY = (int)(y / heightScale);

            resizedImageData[y * targetWidth + x] = imageData[originalY * originalWidth + originalX];
        }
    }

    for (int i = 0; i < targetWidth * targetHeight; i++) {
        imageData[i] = resizedImageData[i];
    }

    free(resizedImageData);
}

// Main function - primarily for testing purposes
int main() {
    // Example: Resize a 10x10 image to 5x5
    int originalWidth = 10;
    int originalHeight = 10;
    int targetWidth = 5;
    int targetHeight = 5;

    // Allocate memory for original image data
    unsigned char* imageData = (unsigned char*) malloc(originalWidth * originalHeight * sizeof(unsigned char));

    // Fill original image with dummy data (for testing)
    for (int i = 0; i < originalWidth * originalHeight; i++) {
        imageData[i] = (unsigned char)(i % 256);
    }

    // Call the resize function
    resizeImage(imageData, originalWidth, originalHeight, targetWidth, targetHeight);

    // Free the allocated memory for original image
    free(imageData);

    return 0;
}

// If you were to run this code, be sure to compile it in Web Assembly format with the following command:
// emcc -o utils/redrawImage.wasm utils/redrawImage.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_resizeImage", "_main"]'
// Be sure that you have Environment Variables set up for emcc and emsdk, as well as Emscripten installed in your system.