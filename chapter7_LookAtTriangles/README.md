# 绘制三个三角形,从指定的视图矩阵的位置查看

也就根据自定的观察者状态(视图矩阵:视点,视线,上方向)来绘制观察者看到的景象

其实就是吧观察矩阵传入shader,在顶点shader中计算顶点的时候,乘以了视图举证,


和前面那个绘制平移,旋转的三角形没有本质区别,只是这里计算不同了,实现了绘制观察者看到的状态.