# face_recognition_service
Sử dụng module <a href="https://github.com/justadudewhohacks/face-recognition.js"><b>face-recognition.js</b></a> để nhận dạng
<a name="install"></a>
# Step 1: Install face-recognition.js

## Requirements

### Linux and OSX
- cmake
- libx11 (XQuartz on OSX) for the dlib GUI (`sudo apt-get install libx11-dev`)
- libpng for reading images (`sudo apt-get install libpng-dev`)

### Windows
- cmake
- VS2017 build tools (not Visual Studio 2017) -> https://www.visualstudio.com/de/downloads/

##  Auto build
Installing the package will build dlib for you and download the models. Note, this might take some time.
``` bash
npm install face-recognition
```

# Boosting Performance

Building the package with openblas support can hugely boost CPU performance for face detection and face recognition.

### Linux and OSX

Simply install openblas (`sudo apt-get install libopenblas-dev`) before building dlib / installing the package.

### Windows

Unfortunately on windows we have to compile [openblas](https://github.com/xianyi/OpenBLAS) manually (this will require you to have perl installed). Compiling openblas will leave you with `libopenblas.lib` and `libopenblas.dll`. In order to compile face-recognition.js with openblas support, provide an environment variable `OPENBLAS_LIB_DIR` with the path to `libopenblas.lib` and add the path to `libopenblas.dll` to your system path, before installing the package. In case you are using a manual build of dlib, you have to compile it with openblas as well.

#Step 2 Install Modules: 
``` bash
npm install
```
#Step 3 Run
``` bash
npm start
```
# API: <a href="https://www.getpostman.com/collections/ed70b5d12476794eaf0f"><b>Postman</b></a>
## Tạo user và train : 
####POST: /classifier/train
####body: formdata : 
key: id, value: userId
key: files, value: file Ảnh của user 
####response
````json
{
    "success": true,
    "data": [
        {
            "className": "userId",
            "numFaces": 21
        }
    ]
}
````
## Nhận diện : 
####POST: predict/file
####body: formdata : 
key: files, value: Ảnh cần nhận diện
####response: 
````json
{
    "success": true,
    "data": {
        "className": "userId",
        "distance": 0.15
    }
}
````