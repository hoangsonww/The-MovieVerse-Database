#include <stdio.h>
#include <stdlib.h>

// Function to apply grayscale filter
void applyGrayscaleFilter(unsigned char* image, int width, int height) {
    int i;
    for(i = 0; i < width * height * 3; i += 3) {
        unsigned char r = image[i];
        unsigned char g = image[i + 1];
        unsigned char b = image[i + 2];
        unsigned char gray = (r + g + b) / 3;
        image[i] = image[i + 1] = image[i + 2] = gray;
    }
}

int main() {
    printf("Image filter module loaded\n");
    return 0;
}

// If you were to run this code, be sure to compile it in Web Assembly format with the following command:
// emcc -o utils/imageFilter.wasm utils/imageFilter.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_applyGrayscaleFilter", "_main"]'
// Be sure that you have Environment Variables set up for emcc and emsdk, as well as Emscripten installed in your system.