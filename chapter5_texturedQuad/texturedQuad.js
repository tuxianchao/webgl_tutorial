
window.onload = () => {
    // 顶点和片元shader
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;//顶点坐标
    attribute vec2 a_TexCoord;//纹理坐标
    varying vec2 v_TexCoord;// 传给片元shader的纹理坐标
    void main(){
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
    `;
    const FSHADER_SOURCE = `
    #ifdef GL_ES
        precision mediump float;
    #endif
    uniform sampler2D u_Sampler;// 2d纹理图片
    varying vec2 v_TexCoord;// 光栅化后的纹理坐标
    void main(){
        // 从纹理上使用纹理坐标采样,计算片元颜色
        gl_FragColor = texture2D(u_Sampler, v_TexCoord);
    }
    `;

    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error(`failed to init webgl context`);
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error(`failed to compile shader or link shader`);
        return;
    }
    // 初始化顶点坐标和纹理坐标
    const n = initVertexBuffers(gl);
    // 设置纹理
    initTextures(gl, n);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

}

/**
 * 初始化顶点buffer,包含顶点坐标和纹理坐标(uv  or  webgl中的st)
 * @param {*} gl 
 */
function initVertexBuffers(gl) {

    // 顶点坐标和纹理坐标
    const verticesTextCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    const pointCount = 4;// 顶点数
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object.`);
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTextCoords, gl.STATIC_DRAW);

    const GL_FLOAT_SIZE = verticesTextCoords.BYTES_PER_ELEMENT;
    // 写顶点坐标数据
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    //写纹理坐标数据
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 4, GL_FLOAT_SIZE * 2)
    gl.enableVertexAttribArray(a_TexCoord);

    return pointCount;
}
/**
 * 配置纹理
 * @param {*} gl webgl上下文
 * @param {*} n 顶点个数
 */
function initTextures(gl, n) {
    // 创建纹理对象
    let texture = gl.createTexture();
    if (!texture) {
        console.warn(`failed to create texture object.`);
        return false;
    }
    // 获取2d纹理在shader中存储的位置
    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    // 创建一个image对象
    let image = new Image();
    // 注册图片加载事件的响应函数
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = "../resources/sky.jpg";
    return true;
}
/**
 * 图片加载完成回调函数
 */
function loadTexture(gl, n, texture, u_Sampler, image) {
    // 对纹理进行y轴反转 ,WEBGL中的uv坐标或者叫st坐标和图片的y轴是是反着的.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);


    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 配置纹理图像,将图片分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将号单元的纹理传给着色器的uniform
    gl.uniform1i(u_Sampler, 0);
    // 绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}