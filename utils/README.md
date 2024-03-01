# Setting up Emscripten and Compiling C Code to WebAssembly - the `utils` directory

## Prerequisites

- A macOS computer (the instructions are specific to macOS).
- Basic knowledge of the command line interface.
- A C compiler like GCC or Clang installed on your system (usually pre-installed on macOS).

## Step 1: Installing Emscripten

Emscripten is a toolchain for compiling C and C++ code to WebAssembly (WASM) which can be run in web browsers. Follow these steps to install Emscripten:

1. **Install Emscripten SDK (emsdk):**

   Open a terminal and run the following commands:

   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh
   ```

   Note that you must have Python installed on your system to run the `emsdk` commands.


2. **Verify Installation:**

   Run `emcc -v` to verify that, it should display the Emscripten version.

## Step 2: Compiling C Code to WebAssembly

Once you have installed Emscripten, you can compile C files to WebAssembly. Here are the specific commands used for different utilities:

1. **Applying Filter to Video:**

   Navigate to the project directory and run:

   ```bash
   emcc -o applyFilterToVideo.wasm utils/applyFilterToVideo.c -O3 -s WASM=1
   ```

2. **Inverting Colors in Video:**

   Run this command in the project directory:

   ```bash
   emcc -o utils/colorInvertingVideo.wasm utils/colorInvertingVideo.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_processVideoFrame", "_main"]'
   ```

3. **Redrawing Image:**

   For resizing and redrawing images, use:

   ```bash
   emcc -o utils/redrawImage.wasm utils/redrawImage.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_resizeImage", "_main"]'
   ```

4. **Applying Filter to Image:**

   For applying filters to images, use:

   ```bash
   emcc -o utils/imageFilter.wasm utils/imageFilter.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_applyGrayscaleFilter", "_main"]'
   ```

5. **Enhance Images:**

   For enhancing images, use:

   ```bash
   emcc -o utils/imageEnhancer.wasm utils/imageEnhancer.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS='["_enhanceBrightness", "_main"]'
   ```

## Notes:

- Ensure the C source files (`applyFilterToVideo.c`, `colorInvertingVideo.c`, `redrawImage.c`) exist in the `utils` folder.
- The `-O3` flag is for optimization.
- The `-s WASM=1` flag specifies that the output should be a WebAssembly module.
- The `-s EXPORTED_FUNCTIONS` flag is optional, used to specify which functions to expose to JavaScript.
- Remember to add the newly-cloned `emsdk` folder to `.gitignore`!

## Troubleshooting

- If you encounter an error about missing files or directories, verify the paths in the commands.
- For issues related to Emscripten, consult the [Emscripten documentation](https://emscripten.org/docs/getting_started/index.html).
- If you have any other questions or concerns, feel free to [contact me](mailto:info@movie-verse.com).

---
