//
window.onload = () => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xFormMatrix;
    void main(){
        // 旋转矩阵
        gl_Position = u_xFormMatrix * a_Position;
        // 旋转后平移
    }
    `;

    const FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
    `;

    const canvas = document.querySelector('#glCanvas');

    const gl = getWebGLContext(canvas);
    if (gl < 0) {
        console.error(`failed  to init webgl context`);
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader source or link shader program `);
        return;
    }

    const ANGLE = 90.0;
    // 转换为弧度制
    const radian = Math.PI * ANGLE / 180.0;
    const sinB = Math.sin(radian);
    const cosB = Math.cos(radian);

    // 旋转矩阵,注意webgl的是矩阵是列主序的
    // const matrix = new Float32Array([
    //     cosB, sinB, 0.0, 0.0,
    //     -sinB, cosB, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0,
    // ]);

    // 平移矩阵
    // const Tx = 0.5, Ty = 0.5, Tz = 0.5;
    // const matrix = new Float32Array([
    //     1.0, 0.0, 0.0, 0.0,
    //     0.0, 1.0, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     Tx, Ty, Tz, 1.0,
    // ]);

    // 缩放矩阵
    const Sx = 0.5, Sy = 1.0, Sz = 1.0;
    const matrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);


    // 将旋转举证传递给shader
    const u_xFormMatrix = gl.getUniformLocation(gl.program, 'u_xFormMatrix');
    gl.uniformMatrix4fv(u_xFormMatrix, false, matrix);

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
