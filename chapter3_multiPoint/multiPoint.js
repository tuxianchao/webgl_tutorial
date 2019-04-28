
window.onload = () => {
    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = 10.0;\n' +
        '}\n';

    const FSHADER_SOURCE =
        'void main(){\n' +
        'gl_FragColor = vec4(0.0,1.0,0.0,1.0);\n' +
        '}\n';
    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);
    if (gl < 0) {
        console.error(`failed to init webgl context`);
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('failed to compile shader source or link shder program');
        return;
    }

    // 获取顶点缓冲对象
    let n = initVertexBuffers(gl);
    if (n < 0) {
        console.error('failed to set position of vertices');
        return;
    }
    ///设置背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //一次性画三个点,数据来源于传递给顶点缓冲对象
    gl.drawArrays(gl.POINTS, 0, 3);
    //  绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 填充顶点缓冲对象
 * @param {webgl} gl 
 */
function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    //三个点
    const pointCount = 3;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('failed to creat buffer object.');
        return -1;
    }

    //将缓冲区绑定到opengl目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //  向缓冲区传递数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //将顶点缓冲的数据分配给a_Position变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position和分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return pointCount;
}
