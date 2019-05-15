


window.onload = () => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xFormMatrix;
    void main(){
        gl_Position = u_xFormMatrix * a_Position;
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
        console.error(`failed to init webgl context.`);
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader source code or link shader program.`);
        return;
    }

    const ANGLE = 90.0;
    // const radian = Math.PI * ANGLE / 180.0;
    // const cosB = Math.cos(radian);
    // const sinB = Math.sin(radian);


    // 旋转矩阵的创建修改为使用coun-matrix.,js
    const matrix = new Matrix4();
    // 创建矩阵并且设置为旋转矩阵
    matrix.setRotate(ANGLE, 0, 0, 1);//绕z轴旋转ANGLE度的矩阵

    /*
    Matrix有一堆setXXX方法,来将矩阵初始化为各种类型的举证(单位矩阵,旋转矩阵,缩放矩阵....)
    */
    const u_xFormMatrix = gl.getUniformLocation(gl.program, 'u_xFormMatrix');
    gl.uniformMatrix4fv(u_xFormMatrix, false, matrix.elements);



    const n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
/**
 * 初始化顶点buffer
 * @param {*} gl 
 */
function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    const pointCount = 3;
    // 创建buffer
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('faile to create vertex buffer object.');
        return -1;
    }

    // 绑点buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 传递数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 连接指针
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //  开启
    gl.enableVertexAttribArray(a_Position);
    return pointCount;
}
