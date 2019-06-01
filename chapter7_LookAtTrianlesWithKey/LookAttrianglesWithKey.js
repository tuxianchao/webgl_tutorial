window.onload = _ => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix;
    void main(){
        v_Color = a_Color;
        gl_PointSize = 10.0;
        gl_Position = u_ViewMatrix * a_Position;
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

    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    let viewMatrix = new Matrix4();

    // 注册监听函数
    document.onkeydown = event => {
        if (event.keyCode === 39) {
            // 按下右键
            eyeX += 0.01;
            console.log(`right`);
        } else if (event.keyCode === 37) {
            // 按下左键
            eyeX -= 0.01;
            console.log(`left`);
        } else {
            console.log(event);
            return;
        }
        viewMatrix.setLookAt
        // draw函数
        draw(gl, n, u_ViewMatrix, viewMatrix);
    }

}
// 视点位置
let eyeX = 0.20, eyeY = 0.25, eyeZ = 0.25;
function draw(gl, n, u_ViewMatrix, viewMatrix) {
    // 设置试点和视线
    viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);

    const pointCount = 9;

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
