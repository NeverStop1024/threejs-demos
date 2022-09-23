// 导入轨道控制器
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { PageContainer } from '@ant-design/pro-components';

// 目标：点光源
const Index = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const init = () => {
    // 获取元素长宽
    const canvasDom = {
      offsetWidth: canvasRef.current?.offsetWidth ?? 0,
      offsetHeight: canvasRef.current?.offsetHeight ?? 0,
    };

    // 1、创建场景
    const scene = new THREE.Scene();

    // 2、创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    // 设置相机位置
    camera.position.set(0, 0, 20);
    scene.add(camera);

    // 创建球几何体
    const sphereGeometry = new THREE.SphereBufferGeometry(3, 30, 30);

    // const mesh = new THREE.Mesh(sphereGeometry, material);
    //
    // scene.add(mesh);

    const pointMaterial = new THREE.PointsMaterial();
    pointMaterial.size = 0.2;
    pointMaterial.color.set(0xfff000);
    // 相机深度而衰减
    pointMaterial.sizeAttenuation = true;

    // 载入纹理
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(require('./images/star_05.png'));
    console.log('texture', texture);
    // // 设置点材质纹理
    pointMaterial.map = texture;
    pointMaterial.alphaMap = texture;
    pointMaterial.transparent = true;
    pointMaterial.depthWrite = false;
    pointMaterial.blending = THREE.AdditiveBlending;

    const points = new THREE.Points(sphereGeometry, pointMaterial);
    scene.add(points);
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer();
    // 设置渲染的尺寸大小
    renderer.setSize(canvasDom.offsetWidth, canvasDom.offsetHeight);
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    // console.log(renderer);
    // 将webgl渲染的canvas内容添加到body

    // @ts-ignore
    canvasRef.current?.appendChild(renderer.domElement);

    // 使用渲染器，通过相机将场景渲染进来
    // renderer.render(scene, camera);

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
    controls.enableDamping = true;

    // 添加坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    function render() {
      controls.update();
      renderer.render(scene, camera);
      //   渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
    render();

    // 监听画面变化，更新渲染画面
    window.addEventListener('resize', () => {
      //   console.log("画面变化了");
      // 更新摄像头
      camera.aspect = canvasDom.offsetWidth / canvasDom.offsetHeight;
      //   更新摄像机的投影矩阵
      camera.updateProjectionMatrix();

      //   更新渲染器
      renderer.setSize(canvasDom.offsetWidth, canvasDom.offsetHeight);
      //   设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  };

  useEffect(() => {
    canvasRef.current.innerHTML = '';
    canvasRef.current!.style.height = `${(canvasRef.current!.offsetWidth / 16) * 9}px`;
    init();
  }, []);

  return (
    <PageContainer>
      <div style={{ width: '80%' }} ref={canvasRef}></div>
    </PageContainer>
  );
};

export default Index;
