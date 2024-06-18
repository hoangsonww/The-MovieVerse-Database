#include <stdio.h>
#include <stdlib.h>

typedef struct {
    unsigned char* data; // Pointer to frame data
    int width;
    int height;
} VideoFrame;

// Function to process a video frame
void processVideoFrame(VideoFrame* frame) {
    for (int i = 0; i < frame->width * frame->height; i++) {
        frame->data[i] = 255 - frame->data[i]; // Inverting colors
    }
}

// Main function - primarily for testing purposes
int main() {
    // Example: Process a single video frame of size 100x100
    int width = 100;
    int height = 100;

    // Allocate memory for a frame
    VideoFrame frame;
    frame.width = width;
    frame.height = height;
    frame.data = (unsigned char*) malloc(width * height * sizeof(unsigned char));

    // Fill frame with dummy data
    for (int i = 0; i < width * height; i++) {
        frame.data[i] = (unsigned char)(i % 256);
    }

    // Call the process function
    processVideoFrame(&frame);

    // Free the allocated memory
    free(frame.data);

    return 0;
}

// If you were to run this code, be sure to compile it in Web Assembly format with the following command:
// emcc -o utils/colorInvertingVideo.wasm utils/colorInvertingVideo.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_processVideoFrame", "_main"]'
// Be sure that you have Environment Variables set up for emcc and emsdk, as well as Emscripten installed in your system.