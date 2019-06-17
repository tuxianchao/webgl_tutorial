window.onload = _ => {

    const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }`;

    const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }`;


    const canvas = document.querySelector('#glCanvas');

    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error('failed to init webgl context');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader source or link shader program.`);
        return;
    }

    const n = initVertextBuffer(gl);

    // 模型，试图，投影矩阵 mvpMatrix

    const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    const modelMatrix = new Matrix4();
    const viewMatrix = new Matrix4();
    const projMatrix = new Matrix4();

    modelMatrix.setTranslate(0.75, 0, 0); //平移0.75单位
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);//设置视点、视线、上方向
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);

    const mvpMatrix = new Matrix4();
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);


    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// 清理深度缓冲



    gl.drawArrays(gl.TRIANGLES, 0, n);//绘制右侧一组三角形
    modelMatrix.setTranslate(-0.75, 0, 0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);//绘制左侧一组三角形




}

function initVertextBuffer(gl) {
    var verticesColors = new Float32Array(
        [
            // Three triangles on the right side
            0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  // 最前面的改为蓝色
            -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
            0.5, -1.0, 0.0, 1.0, 0.4, 0.4,

            0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // 中间是黄色
            -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
            0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

            0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // 最后面是绿色
            -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
            0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
        ]);
    const n = 9;

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.warn(`failed to create vertex buffer object.`);
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.warn(`failed to get storage location of a_Position.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.warn(`failed to get storage location of a_Color.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return n;

}