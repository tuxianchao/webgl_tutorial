# << WebGL编程指南>>练习代码

## DrawRectangle
cavans 2d图形绘制

## HelloCanvas
清除颜色

## DrawPoint
绘一个点,简单的shader使用


## 第五章

multiAttributeSize:
使用两个顶点缓冲对象传递顶点数据和顶点尺寸信息到顶点shader,来绘制出尺寸不同的图形
这种方式是在js程序中,创建两个顶点缓冲对象,然后提交给shader

multiAttributeSize_Iterlaved:
这种方式是在上次的基础上,将使用两个顶点缓冲对象合并为使用一个顶点缓冲对象,

说了这么多,可能就是为了讲解在数组传递个顶点shader的时候使用步进和偏移参数来吧数组按照规则赋值给shader中不同的参数.


multiAttributeColor:

为了讲解varying变量的使用吧,varying变量的意思就是从本来可以使用uniform向片元shader中传递数据,但是那是不变的,
为了给片元shader传递可变的数据,可以利用varying将变量传递给顶点shader,然后使用varying变量将数据在流水线中从顶点shader传递给片元shader,

所有varying变量的作用就是将顶点shader中的数据传递给片元shader.

