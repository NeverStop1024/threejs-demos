// 导入轨道控制器
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { PageContainer } from '@ant-design/pro-components';

// 目标：漫天雪花
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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    // 设置相机位置
    camera.position.set(0, 0, 8);
    scene.add(camera);

    const cubeGemometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
    });
    const redMaterial = new THREE.MeshBasicMaterial({
      color: '#ff0000',
    });
    // 1000个立方体
    const cubeArr = [];
    for (let i = -5; i < 5; i++) {
      for (let j = -5; j < 5; j++) {
        for (let z = -5; z < 5; z++) {
          const cube = new THREE.Mesh(cubeGemometry, material);
          cube.position.set(i, j, z);
          scene.add(cube);
          cubeArr.push(cube);
        }
      }
    }

    // 创建投射光线对象
    const raycaster = new THREE.Raycaster();

    // 鼠标位置对象
    const mouse = new THREE.Vector2();

    // 监听鼠标的位置
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.offsetX / canvasDom.offsetWidth) * 2 - 1;
      mouse.y = -((event.offsetY / canvasDom.offsetHeight) * 2 - 1);
      raycaster.setFromCamera(mouse, camera);
      const result = raycaster.intersectObjects(cubeArr);
      if (result.length) {
        result.forEach((item) => {
          item.object.material = redMaterial;
        });
      }
      console.log(result);
    });

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

    // 设置时钟
    // const clock = new THREE.Clock();
    function render() {
      // const time = clock.getElapsedTime();

      controls.update();
      renderer.render(scene, camera);
      //   渲染下一帧的时候就会调用render函数
      requestAnimationFrame(render);
    }
    render();

    // 监听画面变化，更新渲染画面
    window.addEventListener('resize', () => {
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
