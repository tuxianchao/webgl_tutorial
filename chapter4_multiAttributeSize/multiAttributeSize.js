window.onload = () => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }
    `;
    const FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    }
    `;

    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error(`filed to init webgl context`);
        return;
    }
    // compile shader
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`filed to compile shader source or link shader program.`);
        return;
    }
    // 初始化顶点buffer
    const n = initVertexBuffer(gl);
    /// 初始化顶点大小buffer
    initVertexSizeBuffer(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);



    gl.drawArrays(gl.POINTS, 0, n);
}
/**
 * 初始化顶点坐标buffer
 * @param {*} gl 
 */
function initVertexBuffer(gl) {

    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    const pointCount = 3;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object.`);
        return;
    }
    // 绑定buffer为ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 绑定数据,和类型化数组vertices绑定
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    console.debug(`init vertex buffer object success.`);
    return pointCount;
}

/**
 * 初始化顶点尺寸buffer
 */
function initVertexSizeBuffer(gl) {

    const size = new Float32Array([
        10.0,
        20.0,
        30.0,
    ]);

    const sizeBuffer = gl.createBuffer();
    if (!sizeBuffer) {
        console.error(`failed to creat buffer`);
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);
}