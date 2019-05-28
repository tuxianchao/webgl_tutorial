window.onload = () => {
    const VSHADER_SOURCE = `
    attribute vec4 a_Position;// 顶点坐标
    attribute vec2 a_TexCoord;// 纹理uv(st)坐标
    varying vec2 v_TexCoord;// 传递给片元shader的varying后的坐标
    void main(){
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
    `;
    const FSHADER_SOURCE = `
    #ifdef GL_ES
        precision mediump float;
    #endif
    uniform sampler2D u_Sampler0;// 纹理1
    uniform sampler2D u_Sampler1;// 纹理2
    varying vec2 v_TexCoord;
    void main(){
        vec4 color0 = texture2D(u_Sampler0,v_TexCoord);
        vec4 color1 = texture2D(u_Sampler1,v_TexCoord);
        gl_FragColor = color0 * color1;
    }
    `;

    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);

    if (gl < 0) {
        console.error('failed to init webgl context.');
        return;
    }

    if (!(initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))) {
        console.error('failed to compile shader or link shader.');
        return;
    }


    const n = initVertexBuffer(gl);
    initTexture(gl, n);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initTexture(gl, n) {
    let texture0 = gl.createTexture();
    let texture1 = gl.createTexture();

    if (!texture0 || !texture1) {
        console.error('failed to create texture object.');
        return false;
    }
    // 获取shader中两种纹理的位置
    const u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    const u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    let image0 = new Image();
    let image1 = new Image();

    image0.src = '../resources/sky.jpg';
    image1.src = '../resources/circle.gif';

    image0.onload = function () {
        // 使用第一个纹理单元
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image1.onload = function () {
        // 使用第二个纹理单元
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    };
    return true;
}

// 两个纹理单元是否准备好
let g_texUnit0 = false;
let g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    if (texUnit === 0) {
        g_texUnit0 = true;
        gl.activeTexture(gl.TEXTURE0);
    } else if (texUnit === 1) {
        g_texUnit1 = true;
        gl.activeTexture(gl.TEXTURE1);
    }

    // 当前已经指定好了纹理单元,只需要配置纹理参数和纹理图片就好了

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 配置纹理图片
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将对应的纹理传递给片元shader
    gl.uniform1i(u_Sampler, texUnit);

    if (g_texUnit0 && g_texUnit1) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}

function initVertexBuffer(gl) {
    // 顶点坐标和纹理坐标
    const verticesTexcoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    const pointCount = 4;//顶点数
    const vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.error('faile to create vertex buffer object.');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexcoords, gl.STATIC_DRAW);


    const GL_FLOAT_SIZE = verticesTexcoords.BYTES_PER_ELEMENT;

    // 写顶点坐标
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    // 写纹理坐标
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 4, GL_FLOAT_SIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return pointCount;
}