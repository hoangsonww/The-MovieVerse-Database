#include <stdio.h>
#include <stdlib.h>

typedef struct {
    unsigned char r, g, b;
} RGB;

typedef struct {
    RGB* pixels;
    int width;
    int height;
} VideoFrame;

// Function to apply a simple filter to a video frame
void applyFilterToFrame(VideoFrame* frame) {
    for (int y = 0; y < frame->height; y++) {
        for (int x = 0; x < frame->width; x++) {
            int index = y * frame->width + x;
            unsigned char gray = (frame->pixels[index].r + frame->pixels[index].g + frame->pixels[index].b) / 3;
            frame->pixels[index].r = gray;
            frame->pixels[index].g = gray;
            frame->pixels[index].b = gray;
        }
    }
}

int main() {
    // Example: Create and process a single frame
    int width = 1920;
    int height = 1080;

    // Allocate memory for a frame
    VideoFrame frame;
    frame.width = width;
    frame.height = height;
    frame.pixels = (RGB*) malloc(width * height * sizeof(RGB));

    // Fill frame with dummy data (for example)
    for (int i = 0; i < width * height; i++) {
        frame.pixels[i].r = i % 256;
        frame.pixels[i].g = i % 256;
        frame.pixels[i].b = i % 256;
    }

    // Apply filter
    applyFilterToFrame(&frame);

    // Free the allocated memory
    free(frame.pixels);

    return 0;
}

// If you were to run this code, be sure to compile it in Web Assembly format with the following command:
// emcc -o utils/applyFilterToVideo.wasm utils/applyFilterToVideo.c -O3 -s WASM=1
// Remember to cd to the root directory of the project before running the command.
// Be sure that you have Environment Variables set up for emcc and emsdk, as well as Emscripten installed in your system.