window.onload = () => {
    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = 10.0;\n' +
        '}\n'
        ;
    const FSHADER_SOURCE =
        'precision mediump float;\n' +
        'uniform vec4 u_FragColor;\n' +// uniform变量
        'void main(){\n' +
        'gl_FragColor = u_FragColor;\n' +
        '}\n';

    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);
    if (gl < 0) {
        console.error('failed to init webgl');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('faile to compile shader source code or link shader program');
        return;
    }

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    canvas.onmousedown = (event) => {
        handleClick(event, gl, canvas, a_Position, u_FragColor);
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


}

let g_points = [];//位置数组
let g_colors = [];//颜色数组
function handleClick(event, gl, canvas, a_Position, u_FragColor) {

    let x = event.clientX;
    let y = event.clientY;

    let rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = ((canvas.height / 2) - (y - rect.top)) / (canvas.height / 2);

    g_points.push([x, y]);
    // 1 3象限红色和绿色, 24象限白色
    if (x >= 0 && y >= 0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (x <= 0 && y <= 0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;
    for (let i = 0; i < len; i++) {
        const xy = g_points[i];
        const rgba = g_colors[i];

        //传输顶点变量
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        //传输unideform数据
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}