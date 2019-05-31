window.onload = _ => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ModelViewMatrix;// 模型视图矩阵
    varying vec4 v_Color;
    void main(){
        gl_Position = u_ModelViewMatrix * a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
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
    //  顶点和颜色类型化数组
    const n = initVertexBuffer(gl);
    /*
       两个矩阵相乘,降低顶点shader的计算量,将不变的数据抽取出来,视图矩阵 * 模型矩阵.
    */
    const viewMatrix = new Matrix4();
    const modelMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    modelMatrix.setRotate(-50, 0, 0, -1);
    //  计算常量
    const modelViewMatrix = viewMatrix.multiply(modelMatrix);

    const u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    const verticesColor = new Float32Array([
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
    const GL_FLOAT_SIZE = verticesColor.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

    // vertx
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.warn(`failed to  get Attribute Location of a_Position`);
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // color
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.warn(`failed to  get Attribute Location of a_Color`);
        return -1
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // clear buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return pointCount;
}