cmake_minimum_required(VERSION 3.28)
project(utilities C)

set(CMAKE_C_STANDARD 11)

add_executable(utilities
        applyFilterToVideo.c
        colorInvertingVideo.c
        imageEnhancer.c
        imageFilter.c
        redrawImage.c)
