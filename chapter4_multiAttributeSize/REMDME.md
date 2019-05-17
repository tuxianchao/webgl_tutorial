# 使用vertex buffer 传递顶点尺寸大小

## attribute变量

attribute变量使用在顶点shader中,
在程序中初始化一个顶点数组
```
const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);
```
创建一个buffer,然后绑定好数据,

shader在执行的时候,每个顶点执行一次main方法,每次按照` gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);`指定的规则读取buffer的数据,来初始化顶点,


这样一来,可以利用buffer为本例的三个顶点一次设置顶点尺寸(gl_PointSize)


```
const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object.`);
        return;
    }
    // 绑定buffer为ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 绑定数据,和类型化数组vertices绑定
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
```