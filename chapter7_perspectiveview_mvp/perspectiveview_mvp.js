window.onload = _ => {
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_ModelMatrix;//模型矩阵
        uniform mat4 u_ViewMatrix;//视图矩阵
        uniform mat4 u_ProjMatrix;//投影矩阵
        varying vec4 v_Color;
        void main(){
            gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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
        console.error(`faild to init webgl context!`);
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader or link shader program.`);
        return;
    }

    const n = initVertexBuffer(gl);

    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');//模型矩阵
    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');//视图矩阵
    let u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');//投影矩阵

    let modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projMatrix = new Matrix4();

    // 计算模型矩阵,视图矩阵,投影矩阵matrix
    modelMatrix.setTranslate(0.75, 0, 0);
    viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.clientHeight, 1, 100);


    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);




    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);// 绘制右侧的一组三角形

    // 计算另外有一侧的三角形重新计算模型矩阵
    modelMatrix.setTranslate(-0.75, 0, 0);// 绘制左侧的一组三角形
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);// 绘制左侧的一组三角形
}
/**
 * 初始化顶点buffer
 */
function initVertexBuffer(gl) {
    // 三个排列在z轴的三角形,本例会通过模型矩阵去变换绘制到左侧和右侧
    const verticesColors = new Float32Array([
        // Three triangles on the right side
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4, // The back green one
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.0, 1.0, -2.0, 1.0, 1.0, 0.4, // The middle yellow one
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  // The front blue one
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
    ]);

    const verticesColorBuffer = gl.createBuffer();
    if (!verticesColorBuffer) {
        console.warn('failed to create vertex buffer object');
        return -1;
    }

    const n = 9;// 顶点数
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;

    // vertex
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.error(`failed to get storage location of a_Position.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // color
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.error(`failed to get storage location of a_Color.`);
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return n;
}