cmake_minimum_required(VERSION 2.8)

project(cpp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fsanitize=threads -pthread -std=c++1y -Wall -Wextra")

add_executable(cpp main.cpp test.cpp fan.cpp)
