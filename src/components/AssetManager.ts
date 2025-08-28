import { CubeTexture, CubeTextureLoader, EventDispatcher, Loader, TextureLoader, AudioLoader} from 'three';
import { FontLoader, GLTFLoader, DRACOLoader } from 'three-stdlib';

export type ResourceType = 'cubeTexture' | 'texture' | 'gltfModel' | 'font' | 'audio';
type LoaderCreator = () => Loaders[keyof Loaders];


export interface ResourceItem {
  name: string;
  type: ResourceType;
  path: string | string[];
  useDraco?: boolean;  
}

export interface Loaders {
  textureLoader: TextureLoader;
  GLTFLoader: GLTFLoader;
  cubeTextureLoader: CubeTextureLoader;
  fontLoader: FontLoader;
  audioLoader: AudioLoader;
}

// 懒加载
const loaderFactoryMap: Record<ResourceType, LoaderCreator> = {
  gltfModel: () => new GLTFLoader(),
  texture: () => new TextureLoader(),
  cubeTexture: () => new CubeTextureLoader(),
  font: () => new FontLoader(),
  audio: () => new AudioLoader(),  // 简单音效建议直接使用js原生Audio
  //   fbxModel: () => new FBXLoader(),
  //   objModel: () => new OBJLoader(),
  //   hdrTexture: () => new RGBELoader(),
  //   svg: () => new SVGLoader(),
  //   exrTexture: () => new EXRLoader(),
  //   ktx2Texture: () => new KTX2Loader(),
  //   video: () => null // 视频特殊处理，不需要 loader
};

export type AssetManagerEventTypes = 'progress' | 'ready';

// 定义事件类型
interface AssetManagerEvent {
  ready: any;
  progress: any;
  [key: string]: any;
  // 可以添加其他事件相关属性
  //progress?: number;
  //error?: Error;
}


export class AssetManager extends EventDispatcher<AssetManagerEvent> {
  resourceList: ResourceItem[];

  // 资产集合（加载完毕后放入该集合）
  items: { [key: string]: any } = {};
  // 资产总数
  toLoad: number;
  // 已加载个数
  loaded: number = 0;
  // 加载器集合
  loaders: Partial<Record<ResourceType, Loaders[keyof Loaders]>> = {};

  constructor(resourceList: ResourceItem[]) {
    super();

    this.resourceList = resourceList;
    this.toLoad = resourceList.length;

    this.startLoading();
  }
  
  // 根据映射关系懒加载加载器，若没有某类型加载器，先加载；加载器已存在，就直接返回。
  private getLoader(type: ResourceType,useDraco: boolean = false): Loaders[keyof Loaders] | undefined {
    if (!this.loaders[type]) {
      const createLoader = loaderFactoryMap[type];
      if (createLoader) {
        this.loaders[type] = createLoader();
      }
    }

    // 使用了DRACO压缩的情况
    if( useDraco && this.loaders[type] instanceof GLTFLoader  ) {
      // 创建解码器实例
      const dracoLoader = new DRACOLoader();
      // 设置解压库文件路径，版本替换地址查询：https://github.com/google/draco
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      // 加载解码器实例
      this.loaders[type].setDRACOLoader(dracoLoader);
    }

    return this.loaders[type];
  }

  // 开始加载
  startLoading() {
    for (const resource of this.resourceList) {
      const loader = this.getLoader(resource.type, resource.useDraco);

      switch (resource.type) {
        case 'cubeTexture':
          (loader as CubeTextureLoader)?.load(resource.path as string[], file => {
            this.resourceLoaded(resource, file);
          });
          break;

        default:
          (loader as Exclude<Loader, CubeTexture>)?.load(resource.path as string, file => {
            this.resourceLoaded(resource, file);
          });
          break;
      }
    }
  }
  // 单个资产加载完毕
  resourceLoaded(resource: ResourceItem, file: any) {
    this.items[resource.name] = file;
    this.loaded++;
    this.dispatchEvent({type:'progress',loaded: this.loaded,total: this.toLoad});

    if (this.isLoaded) {
      this.dispatchEvent({ type: 'ready' });
    }
  }

  dispose() {

  }

  get isLoaded() {
    return this.loaded === this.toLoad;
  }
}

