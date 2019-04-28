window.onload = () => {

    const VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'attribute float a_PointSize;\n' +
        'void main(){\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = a_PointSize;\n' +
        '}\n';

    const FSHADER_SOURCE =
        'void main(){\n' +
        'gl_FragColor =  vec4(1.0,0.0,0.0,1.0);\n' +
        '}\n';


    const canvas = document.querySelector('#glCanvas');
    const gl = getWebGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('failed to init shader');
        return;
    }

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0 || a_Position < 0) {
        console.warn('failed to get stroage location ');
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //注册鼠标监听事件获取点击cavans的位置
    canvas.onmousedown = (event) => {
        console.log(event);
        handleClick(event, gl, canvas, a_Position);
    }


}
// 位置数组
const g_points = [];
/**
 * 处理鼠标点击canvas
 */
function handleClick(event, gl, canvas, a_Position) {
    let x = event.clientX;
    let y = event.clientY;
    const rect = event.target.getBoundingClientRect();
    // 坐标转换
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);


    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    g_points.push(x);
    g_points.push(y);

    const len = g_points.length;
    for (let i = 0; i < len; i += 2) {
        // 步长为2
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
        console.debug('draw a point(' + g_points[i] + ',' + g_points[i + 1] + ',' + 0.0 + ')');
    }
}