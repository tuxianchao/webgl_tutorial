const ANGLE_STEP = 30.0;// 每次旋转的角度
window.onload = () => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main(){
        gl_Position = u_ModelMatrix * a_Position;
    }
    `;
    const FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
    `;
    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);
    if (gl < 1) {
        console.error(`failed to init webgl context`);
        return;
    }
    if (!(initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))) {
        console.error(`failed to compile shader or link shader program`);
        return;
    }
    const n = initVertexBuffer(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

    // 动画的绘制,


    let currentAngle = 0.0;// 当前旋转的角度

    const modelMatrix = new Matrix4();//模型矩阵

    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    const that = this;
    // 60 fps
    let loop = function () {
        currentAngle = animate(currentAngle);//计算当前应该旋转的角度
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        window.requestAnimationFrame(loop);
    }
    loop();
}

/**
 * 每次循环的时候调用draw函数,传递新的uniform变量进去
 * 
 * @param {*} gl 
 * @param {*} n 
 * @param {*} currentAngle  当前角度
 * @param {*} modelMatrix 旋转矩阵
 * @param {*} u_ModelMatrix 旋转矩阵变量名
 */
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {

    modelMatrix.setRotate(currentAngle, 0, 0, 1);//z轴旋转
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
/**
 * 计算当前角度
 */
let g_last = Date.now();// 上次旋转的时间
function animate(angle) {

    const now = Date.now();
    const elapsed = now - g_last;
    g_last = now;

    const newAngle = angle + (ANGLE_STEP * (elapsed) / 1000);
    // 计算出新角度
    return newAngle % 360;
}

/**
 * 初始化顶点数据
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
        console.error(`failed to create vertex buffer object`);
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    console.debug(`init vertex buffer object success.`);
    return pointCount;
}