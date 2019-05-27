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
    uniform sampler2D u_Sampler0;// 纹理1
    uniform sampler2D u_Sampler1;// 纹理2
    varying vec2 v_TexCoord;
    void main(){

    }
    `;

    const canvas = document.querySelector('#canvas');
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    const vertextBuffer = gl.createBuffer();

    if (!vertextBuffer) {
        console.error('faile to create vertex buffer object.');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexcoords, gl.STATIC_DRAW);


    const GL_FLOAT_SIZE = verticesTexcoords.BYTES_PER_ELEMENT;

    // 写顶点坐标
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 写纹理坐标
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    

}