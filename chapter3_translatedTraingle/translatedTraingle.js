window.onload = () => {
    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'uniform vec4 u_Translation;\n' +//传递一个unifrom变量进来表示在xyz轴上移动的距离.
        'void main(){\n' +
        'gl_Position = a_Position+u_Translation; \n' +
        '}';
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
        console.error('faile to compile shader source or link shader program.');
        return;
    }

    const n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
/**
 * 初始化顶点buffer
 */
function initVertexBuffers(gl) {
    // 顶点数据
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
    // 顶点数据,z值全为0(平面)
    const pointCount = 3;
    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('faile to create vertext buffer object');
        return -1;
    }
    // 绑定缓冲区到arraybuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 传递数据到buffer
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // 将顶点缓冲区数分配给shader中的变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 开启/连接顶点缓冲数据和变量
    gl.enableVertexAttribArray(a_Position);

    // 传递一个uniform的变量来表示偏移的量
    const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    const tx = 0.5,
        ty = 0.5,
        tz = 0;
    // 传递uniform变量到shader program,最后传一个0.0即可,两个向量相加后需要得到一个齐次坐标,0.0+原来的1.0 = 1.0
    gl.uniform4f(u_Translation, tx, ty, tz, 0.0);
    return pointCount;
}