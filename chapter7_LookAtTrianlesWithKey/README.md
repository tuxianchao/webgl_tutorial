## 键盘旋转查看三角形

在三角形进行视图矩阵变化的基础上,通过键盘事件监听,来实时查看从不同的视点查看空间中的三角形.

当视点(eyeX,eyeY,eyeZ)移动到极左或者极右的时候,会出现某些角度看不到,也就是说,不在可视范围之内,

由此,引出可视范围的概念.讲常见的两种可视空间:

* 正交投影产生的长方体可视空间,也叫盒状空间.
* 透视投影产生的四棱锥/金字塔可视空间.


## 正交投影可视化空间
其实就是由远裁面和近裁面组成的盒状空间,所看到的其实就是可视空间(近裁面到远裁面)中的物体在近裁面上的投影.

## 透视可视空间
