# molstar-viewer-vue

`molstar-viewer-vue`将[Molstar Viewer](https://molstar.org/viewer/)封装为Vue组件，以便于在Vue项目中呈现`molstar`。

## 采用的技术架构

- `molstar`：`v4.0.1`

- `Vue`：`v3.4.15`

## 运行项目

### 安装依赖

```sh
yarn
```

### 本地开发

```sh
yarn dev
```

### 编译打包

```sh
yarn build
```

## MolstarViewer组件介绍

### Props

> `Props`中的绝大部分属性同样支持在`query`中进行传参。而且，`query`的优先级高于`Props`。

#### 渲染数据相关

| Prop                   | 类型           | 默认值  | 描述                                                         |
| ---------------------- | -------------- | ------- | ------------------------------------------------------------ |
| `fileData`             | `String,Array` | `-`     | 可视化文件数据。需搭配`fileFormat`、`fileDataLabel`一起使用。 |
| `fileFormat`           | `String`       | `-`     | 可视化文件的文件类型。需搭配`fileData`、`fileDataLabel`一起使用。 |
| `fileDataLabel`        | `String`       | `''`    | 可视化文件的标签。用于充当`State Tree`的根节点名称。需搭配`fileFormat`、`fileFormat`一起使用。 |
| `snapshotId`           | `String`       | `-`     | Snap Shot可视化ID                                            |
| `snapshotUrl`          | `String`       | `-`     | Snap Shot可视化文件地址                                      |
| `snapshotUrlType`      | `String`       | `molj`  | Snap Shot可视化文件类型。可选择为：`json`、`molj`、`zip`、`molx` |
| `structureUrl`         | `String,Array` | `-`     | Structure可视化文件地址。支持同时渲染多个文件。              |
| `structureUrlFormat`   | `String`       | `-`     | Structure可视化文件类型。                                    |
| `structureUrlIsBinary` | `Boolean`      | `false` | Structure可视化文件是否是二进制                              |
| `mvsUrl`               | `String`       | `-`     | mvs可视化文件地址                                            |
| `mvsFormat`            | `String`       | `mvsj`  | mvs可视化文件类型。可选择为：`mvsj`、`mvsx`                  |
| `mvsData`              | `String`       | `-`     | mvs数据源                                                    |
| `pdb`                  | `String`       | `-`     | pdb 的 ID。支持同时渲染多个，用`,`分隔。如：`1rlw,1tqn`      |
| `pdbDev`               | `String`       | `-`     | pdbDev 的 ID。支持同时渲染多个，用`,`分隔。                  |
| `emdb`                 | `String`       | `-`     | EMDB 的 ID。支持同时渲染多个，用`,`分隔。                    |
| `afdb`                 | `String`       | `-`     | AlphaFold DB 的 ID。支持同时渲染多个，用`,`分隔。            |
| `modelArchive`         | `String`       | `-`     | ModelArchive ID。支持同时渲染多个，用`,`分隔。               |

#### molstar viewer 配置项

| Prop                          | 类型      | 默认值               | 描述                                                                        |
| ----------------------------- | --------- | -------------------- | --------------------------------------------------------------------------- |
| `debugMode`                   | `Boolean` | `false`              | 配置项。开启debug模式。                                                     |
| `timingMode`                  | `Boolean` | `false`              | 配置项。开启timing模式。                                                    |
| `disabledExtensions`          | `Array`   | `[]`                 | 配置项。禁用指定molstar扩展项。                                             |
| `hideControls`                | `Boolean` | `false`              | 配置项。隐藏四周控制栏。                                                    |
| `collapseLeftPanel`           | `Boolean` | `false`              | 配置项。收起左侧控制栏。                                                    |
| `pdbProvider`                 | `String`  | `pdbe`               | 配置项。pdb数据源。默认`pdbe`（Protein Data Bank in Europe）。              |
| `emdbProvider`                | `String`  | `pdbe`               | 配置项。emdb数据源。默认`pdbe`（Protein Data Bank in Europe）。             |
| `mapProvider`                 | `String`  | `pdbe`               | 配置项。map数据源。默认`pdbe`（Protein Data Bank in Europe）。              |
| `pixelScale`                  | `Number`  | `1`                  | 配置项。像素比例。值越大清晰的越高，消耗的性能越大。采用默认值即可。        |
| `pickScale`                   | `Number`  | `0.25`               | 配置项。                                                                    |
| `pickPadding`                 | `Number`  | `1`                  | 配置项。                                                                    |
| `transparency`                | `String`  | `-`                  | 配置项。透明模式。可选值：`blended`、`wboit`、`dpoit`。                     |
| `preferWebgl1`                | `Boolean` | `-`                  | 配置项。是否启用WebGL 1。默认根据设备自动开启关闭。                         |
| `allowMajorPerformanceCaveat` | `Boolean` | `false`              | 配置项。是否允许在WebGL的上下文中接受某些可能会显著降低性能的配置或行为。   |
| `powerPreference`             | `String`  | `'high-performance'` | 配置项。WebGL性能模式。可选择：`default`、`high-performance`、`low-power`。 |

### Methods

| Method         | 参数 | 描述                      |
| -------------- | ---- | ------------------------- |
| `getExtension` | --   | 获取`MolstarViewer`扩展项 |
| `getViewer`    | --   | 获取`MolstarViewer`实例   |

### 支持的文件类型

#### Structure

- MMCIF and CIFCORE (mmCIF and coreCIF schemas): cif, bcif, mmcif, mcif
- GRO: gro
- MOL: mol
- MOL2: mol2
- PDB/PDBQT: pdb, ent, pdbqt
- SDF: sdf, sd
- XYZ: xyz

#### Topology

Need to be loaded together with Coordinates.

- PRMTOP: prmtop, parm7
- PSF: psf
- TOP: top

#### Coordinates

Need to be loaded together with a Structure or Topology.

- DCD: dcd
- NCTRAJ: nc, nctraj
- TRR: trr
- XTC: xtc

#### Volume

- CCP4/MRC/MAP: ccp4, mrc, map
- CUBE (may include a Structure): cub, cube
- DSN6/BRIX: dsn6, brix
- DX and DXBIN: dx, dxbin
- DSCIF (DensityServer CIF schema): cif, bcif

> 关于PLY文件：由于[Molstar Viewer](https://molstar.org/viewer/)暂未支持通过传参的形式渲染PLY文件。故而本组件也不支持。

### 使用说明

首先安装molstar-vue插件：

```bash
yarn add molstar-vue
```

然后在项目中引入**MolstarViewer组件**：

```js
import MolStarViewer from 'molstar-vue'
```

## Author

- Z-J-wang <https://github.com/Z-J-wang>

## LICENSE

[MIT](https://opensource.org/licenses/MIT)
