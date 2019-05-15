// 三角形绕着z轴旋转B度

// x' = x cos b - y sin b 
// y' = x sin b + y cos b
// z' = z

// 旋转角度
const ANGLE = 90.0;
window.onload = () => {
    const VSHADER_SOURCE =
        // x' = x cos b - y sin b 
        // y' = x sin b + y cos b
        // z' = z
        'attribute vec4 a_Position;\n' +
        'uniform float u_CosB, u_SinB;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        'gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
        'gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
        'gl_Position.z = a_Position.z;\n' +
        'gl_Position.w = 1.0;\n' +
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

    // 传递两个uniform进去
    // 转换为弧度制 
    let radian = Math.PI * ANGLE / 180.0;
    let sinB = Math.sin(radian);
    let cosB = Math.cos(radian);
    console.debug(sinB);
    console.debug(cosB);
    let u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    if (!u_SinB || !u_CosB) {
        console.error('Failed to get the storage uniform location!');
        return;
    }
    console.debug(u_SinB, u_CosB);

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);


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
