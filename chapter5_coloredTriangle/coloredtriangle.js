window.onload = () => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
    }
    `;
    const FSHADER_SOURCE = `
    void main(){
        // 内置变量gl_FragCoord表示当前处理片元在canvas坐标系中的坐标值
        // 为了验证这个,可以做一个渐变的例子
        // gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        uniform float u_Width;
        uniform float u_Height;
        gl_FragColor = vec4(gl_FragCoord.x, 0.0, gl_FragCoord.y, 1.0);
    }
    `;
    const canvas = document.querySelector('#glCanvas');

    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error(`failed to init webgl context`);
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader or link shader program`);
        return;
    }

    const n = initVertexBuffer(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}


/**
 * 初始化三角形的顶点buffer
 */
function initVertexBuffer(gl) {

    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ]);

    const pointCount = 3;// 三个顶点
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object`);
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return pointCount;


}