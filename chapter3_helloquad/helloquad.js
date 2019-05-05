window.onload = () => {

    const VSHADER_RESOURCE =
        'attribute vec4 a_Position;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        '}';
    const FSHADER_RESOURCE =
        'void main(){\n' +
        'gl_FragColor = vec4(0.0,1.0,0.0,1.0);\n' +
        '}';
    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error('failed init webgl context');
        return;
    }

    if (!(initShaders(gl, VSHADER_RESOURCE, FSHADER_RESOURCE))) {
        console.error('failed to compile shader source or  link shader program.');
        return;
    }

    const n = initVertexBuffers(gl);
    if (n < 0) {
        console.error('faile to set position of vertices');
        return;
    }

    ///设置背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制由两个三角形组成的矩形
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // 修改为TRIANGLE_FAN,就可以改变绘制顺序,绘制出飘带的效果
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}
/**
 * 填充顶点缓冲对象
 * @param {*} gl 
 */
function initVertexBuffers(gl) {

    //修改为4个点
    const vertices = new Float32Array([
        -0.5, 0.5,
        -0.5, -0.5,
        0.5, 0.5,
        0.5, -0.5
    ]);
    //三个点
    const pointCount = 4;
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('failed to creat buffer object.');
        return -1;
    }

    //将缓冲区绑定到opengl目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //  向缓冲区传递数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //将顶点缓冲的数据分配给a_Position变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position和分配给他的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return pointCount;

}