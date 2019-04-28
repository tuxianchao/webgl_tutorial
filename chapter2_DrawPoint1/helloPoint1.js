window.onload = () => {
    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = 10.0;\n' +
        '}\n'
        ;
    const FSHADER_SOURCE =
        'void main(){\n' +
        'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
        '}\n'
        ;


    // 获取cavans
    const canvas = document.querySelector('#glCanvas');
    // 获取webgl上下文
    const gl = getWebGLContext(canvas);

    // 初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('failed init shader');
        return;
    }

    //  获取shader中attribute存储的位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.warn('failed to get storage location of a_Positon');
        return;
    }

    // 将数据传递给attribute
    gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINT, 0, 1)
}