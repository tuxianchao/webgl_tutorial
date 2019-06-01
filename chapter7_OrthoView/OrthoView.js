window.onload = _ => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ProjMatrix;
    varying vec4 v_Color;
    void main(){
        gl_PointSize = 10.0;
        v_Color = a_Color;
        gl_Position = u_ProjMatrix * a_Position;
    }
    `;
    const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor= v_Color;
    }
    `;

    const canvas = document.querySelector(`#glCanvas`);
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error(`failed to init webgl context.`);
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader or link shader program`);
        return;
    }

    const n = initVertexBuffer(gl);

    // 获取正交投影矩阵变量
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    const projMatrix = new Matrix4();
    // 第一次draw一屏初始化状态
    draw(gl, n, u_ProjMatrix, projMatrix);
    document.onkeydown = event => {
        switch (event.keyCode) {
            case 39: near += 0.01; break; //right
            case 37: near -= 0.01; break; //left
            case 38: far += 0.01; break; //up
            case 40: far -= 0.01; break; //down
            default: return;
        }
        draw(gl, n, u_ProjMatrix, projMatrix);
    }

}
// 近裁面和远裁面参数
let near = 0.0, far = 0.5;
function draw(gl, n, u_ProjMatrix, projMatrix) {
    // 参数 近裁面的左右边界,远裁面的左右边界,近裁面和远裁面的位置
    projMatrix.setOrtho(-1, 1, -1, 1, near, far);

    //将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.clear(gl.COlOR_BUFFER_BIT);
    document.querySelector('#nearFar').innerHTML =
        `near: ${Math.round(near * 100) / 100} , far: ${Math.round(far * 100) / 100}`;
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
    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    // vertex
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    // color
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return pointCount;
}