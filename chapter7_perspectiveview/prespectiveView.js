window.onload = _ => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix; // 视图矩阵
    uniform mat4 u_ProjMatrix; // 投影矩阵
    void main(){
        v_Color = a_Color;
        gl_PointSize = 10.0;
        gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;
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
        console.error(`failed to init webgl context.`);
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader or link shader program.`);
        return;
    }
    const n = initVertexBuffer(gl);
    // 视图矩阵
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    // 透视投影矩阵
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    const projMatrix = new Matrix4();
    // 设置为透视投影矩阵,参数:垂直视角,近裁面宽高比,远裁面,近裁面的位置
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);


    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    const verticesColors = new Float32Array([
        // Three triangles on the right side
        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
        0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

        // Three triangles on the left side
        -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
        -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        -0.25, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);

    const pointCount = 18;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.warn(`failed to create vertex object buffer`);
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;
    // vertex
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.warn(`failed to get location of a_Position.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // color
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.warn(`failed to get location of a_Color.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return pointCount;
}
