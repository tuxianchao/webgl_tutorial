window.onload = () => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute float a_PointSize;
    varying vec4 v_Color;//varying变量
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        v_Color = a_Color;
    }
    `;
    const FSHADER_SOURCE = `
    // 需要在片元shader中指定浮点数的精度,否则No precision specified for (float)
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        //gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        gl_FragColor = v_Color;//修改为获取从顶点shader传递过来的数据.
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
    // // 初始化顶点buffer
    // const n = initVertexBuffer(gl);
    // /// 初始化顶点颜色buffer
    // initVertexColorBuffer(gl);


    //  顶点坐标和颜色合为一个buffer
    const n = initVertexBuffer(gl);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // gl.drawArrays(gl.POINTS, 0, n);
    //做个试验,改成绘制三角形,就会绘制出彩色的三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


/**
 * 初始化顶点坐标和颜色buffer
 * @param {*} gl
 */
function initVertexBuffer(gl) {

    // 顶点的坐标和颜色信息.
    const verticesColors = new Float32Array([
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0,
    ]);
    // 顶点数量
    const pointCount = 3;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object.`);
        return;
    }
    // 将顶点数据和颜色数据写入buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);


    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;
    /**
     * 使用同一个buffer来存储顶点坐标和颜色信息,在给顶点shader传递数据的时候,在绑点
     * 指定阶段告诉gl规则即可(每次取得多少,在数组中取的步长是多少,偏移是多少);
     */

    //获取a_Position的位置,然后开启分配区缓冲
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // 获取a_PointSize的位置,然后开启分配区缓冲
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 2)
    gl.enableVertexAttribArray(a_PointSize);

    // 获取a_Color的位置,然后开启分配去缓冲
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);


    console.debug(`init vertex buffer object success.`);
    return pointCount;
}
// /**
//  * 初始化顶点坐标buffer
//  * @param {*} gl
//  */
// function initVertexBuffer(gl) {

//     const vertices = new Float32Array([
//         0.0, 0.5,
//         -0.5, -0.5,
//         0.5, -0.5
//     ]);

//     const pointCount = 3;

//     const vertexBuffer = gl.createBuffer();
//     if (!vertexBuffer) {
//         console.error(`failed to create vertex buffer object.`);
//         return;
//     }
//     // 绑定buffer为ARRAY_BUFFER
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     // 绑定数据,和类型化数组vertices绑定
//     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//     const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);
//     console.debug(`init vertex buffer object success.`);
//     return pointCount;
// }

// /**
//  * 初始化顶点颜色buffer
//  */
// function initVertexColorBuffer(gl) {

//     const verticesColors = new Float32Array([
//         10.0,
//         20.0,
//         30.0,
//     ]);

//     const sizeBuffer = gl.createBuffer();
//     if (!sizeBuffer) {
//         console.error(`failed to creat buffer`);
//         return -1;
//     }
//     gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
//     const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
//     gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_PointSize);
// }
