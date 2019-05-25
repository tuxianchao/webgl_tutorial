# 其实这三个工程主要的目的啊还是理清楚shader的使用

几种变量的使用
* attribute的变量
* uniform的变量
* varying的变量

##  attribute的变量
attribute变量就是传递给顶点shader的,在js程序中,使用一个类型化的数组存储数据

```
const verticesColors = new Float32Array([
        0.0, 0.5, 10.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 20.0, 0.0, 1.0, 0.0,
        0.5, -0.5, 30.0, 0.0, 0.0, 1.0,

```

然后完shader后获取变量的位置,传递数据
shader:
```
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute float a_PointSize;
    varying vec4 v_Color;//varying变量
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        v_Color = a_Color;
    }
    `;
    const FSHADER_SOURCE = `
    // 需要在片元shader中指定浮点数的精度,否则No precision specified for (float)
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        //gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        gl_FragColor = v_Color;//修改为获取从顶点shader传递过来的数据.
    }
    `;
```

传递数据:
```
const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error(`failed to create vertex buffer object.`);
        return;
    }
    // 将顶点数据和颜色数据写入buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);


    const GL_FLOAT_SIZE = verticesColors.BYTES_PER_ELEMENT;
    /**
     * 使用同一个buffer来存储顶点坐标和颜色信息,在给顶点shader传递数据的时候,在绑点
     * 指定阶段告诉gl规则即可(每次取得多少,在数组中取的步长是多少,偏移是多少);
     */

    //获取a_Position的位置,然后开启分配区缓冲
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, GL_FLOAT_SIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    // 获取a_PointSize的位置,然后开启分配区缓冲
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 2)
    gl.enableVertexAttribArray(a_PointSize);

    // 获取a_Color的位置,然后开启分配去缓冲
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, GL_FLOAT_SIZE * 6, GL_FLOAT_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);

```

最后运行的时候,顶点shader的main简书就按照在js程序中指定的规则(取几个,从那儿去,偏移量)来取数据,传给顶点shader的变量,

所以可以用来传递顶点的位置数组,顶点的颜色数据,顶点的尺寸数据,每次按照规则取就可以了.

## uniform的变量

uniform变量用在片元shader中,在片元shader中,unifrom变量是固定的.

首先在片元shader中申明一个unifrom的变量接收参数,

```
const FSHADER_SOURCE =
        'precision mediump float;\n' +
        'uniform vec4 u_FragColor;\n' +// uniform变量
        'void main(){\n' +
        'gl_FragColor = u_FragColor;\n' +
        '}\n';
```

然后在js程序中传递数据给片元着色器uniform类型的变量


```
//传输unideform数据
gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
```



##  varying的变量

要想给片元着色器传递可变的数据,就不能使用unifrom类型的变量,所以varying存在即合理了

varying是在流水线上顶点shader向片元shader传递数据,

也就是在片元shader中声明数据
```
const FSHADER_SOURCE = `
    // 需要在片元shader中指定浮点数的精度,否则No precision specified for (float)
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        //gl_FragColor = vec4(0.0,1.0,0.0,1.0);
        gl_FragColor = v_Color;//修改为获取从顶点shader传递过来的数据.
    }
    `;
```

只要在顶点shader中为同名变量v_Color赋值就传递给片元shader了.

利用顶点shader attribute传递可变的数据就可以再使用varying变量就可以间接的实现js程序传递可变的数据给片元shder.