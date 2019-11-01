# 遮挡面消除


opengl的遮挡面消除功能

我认为：在3d的世界，模拟的就是现实世界，真实的3d，不是通过类似于谁先绘制，谁后绘制来完成的遮挡，因为通过移动视点，看到的就是不一样的，

所以opengl提供了这个功能来消除遮挡的三角面。


* 开启功能
`gl.enable(gl.DEPTH_TEST)`

* 在绘制之前清除胜读缓冲区
`gl.clear(gl.DEPTH_BUFFER_BIT)`
