window.onload = () => {
    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        '}\n';
    const FSHADER_SOURCE =
        'void main(){\n' +
        'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
        '}';
    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error('failed to init webgl context.');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('failed compile shader source or link shader program.');
        return;
    }
    const n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 初始化顶点数据
 */
function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    const pointCount = 3;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('faile to create vertex buffer object.');
        return -1;
    }
    // 顶点数据处理
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return pointCount;
}
