## 共冶一炉(模型矩阵,视图矩阵,和投影矩阵)


* <模型矩阵> * <顶点坐标>
    使用模型矩阵乘以顶点坐标就描述了顶点位置变换的过程(平移,旋转,缩放)
* <视图矩阵> * <模型矩阵> * <顶点坐标>
    就实现了从指定位置观看经过变换后的三角形的,也就是相当于设置了相机的相关属性.看到的是通过相机看到经过变换后的图形.
    也就是前面的从不同的位置查看三角形

* <投影矩阵> * <视图矩阵> * <顶点坐标>
    在3d里从,存在两种投影矩阵(正交投影矩阵,或者透视投影矩阵),经过投影矩阵的变换后,就实现了计算最终的三角形,看到的那些东西,也就是实现了解决之前的bug,不能看到被裁减的部分.

* <投影矩阵> * <视图矩阵> * <模型矩阵> * <顶点坐标>
    在webgl中,使用以上计算就可以计算出最终的顶点坐标(即顶点在规范立方体中的坐标,或者说叫做我们要在平面上看到3D效果需要怎么绘制的坐标描述).
  

另外还试下了一个问题,用了三个三角形的顶点数据,绘制了6个三角形,虽然节省了数据的传输,但是增加的drawArrays的调用,在游戏中也就是增加了drawcall
