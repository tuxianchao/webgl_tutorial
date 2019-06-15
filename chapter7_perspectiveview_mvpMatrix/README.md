# 合并mvp矩阵

其实传递三个矩阵(modelMatrxi,viewMatrix,projMatrxi)到顶点shader中去,然后在逐顶点的时候们每次都
`投影矩阵 * 视图举证 * 模型矩阵`是一种浪费,这种固定值不如直接计算好,传递一个矩阵进去.