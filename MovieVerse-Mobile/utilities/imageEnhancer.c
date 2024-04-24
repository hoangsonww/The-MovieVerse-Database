#include <stdio.h>
#include <stdlib.h>

// Function to enhance brightness of an image
void enhanceBrightness(unsigned char* image, int width, int height, int brightness) {
    int i;
    for(i = 0; i < width * height * 3; i++) {
        int value = image[i] + brightness;
        if(value > 255) value = 255;
        if(value < 0) value = 0;
        image[i] = (unsigned char)value;
    }
}

int main() {
    printf("Image enhancer module loaded\n");
    return 0;
}

// If you were to run this code, be sure to compile it in Web Assembly format with the following command:
// emcc -o utils/imageEnhancer.wasm utils/imageEnhancer.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_enhanceBrightness", "_main"]'
// Be sure that you have Environment Variables set up for emcc and emsdk, as well as Emscripten installed in your system.
