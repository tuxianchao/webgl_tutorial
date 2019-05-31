window.onload = _ => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;// 顶点
    attribute vec4 a_Color;// 颜色
    uniform mat4 u_ViewMatrix;//视图矩阵(包含视点,观察点目标,上方向信息).
    varying vec4 v_Color;//传递给片元shader的颜色
    void main(){
        gl_Position = a_Position * u_ViewMatrix;
        gl_PointSize = float(10);
        v_Color= a_Color;
    }
    `;
    const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
    `;

    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error(`failed to create webgl context.`);
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compil shader or link shader program.`);
        return;
    }
    // 设置顶点和颜色
    const n = initVertexBuffer(gl);
    //  设置视图矩阵
    const viewMatrix = new Matrix4();
    // 设置视点,视线,向上方向
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //清空<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initVertexBuffer(gl) {
    const verticesColors = new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green one
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow one
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // The front blue one
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);

    const pointCount = 9;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.warn(`failed to create vertex buffer object.`);
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);


    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.warn(`faild to get attribute location of a_Position`);
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position)

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.warn(`failed to get attribute location of a_Color`);
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // 取消绑定
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return pointCount;
}