import {
    Vector3,
    SphereGeometry,
    MeshBasicMaterial,
    Mesh,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Geometry,
} from 'three'
import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
import { handleMouseMove, handleMouseDown } from './operation'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { EyeDomeLightingMaterial } from './EdlMaterial'
import EdlRenderer from './edlRenderer'
import generateClipBox from './clipboxes'

let isUseEdl = true

const ClipMode = {
    DISABLED: 0,
    CLIP_OUTSIDE: 1,
    HIGHLIGHT_INSIDE: 2,
}

const PointSizeType = {
    FIXED: 0,
    ATTENUATED: 1,
    ADAPTIVE: 2,
}

const init = () => {
    const scene = new Scene()
    const sceneBG = new Scene()
    sceneBG.background = new THREE.Color(0x444444)

    const scenePC = new Scene()
    const camera = new PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    camera.position.set(0, 0, 30)
    camera.up.set(0, 0, 1)

    const renderer = new WebGLRenderer({
        alpha: true,
        premultipliedAlpha: false,
    })
    renderer.sortObjects = false
    renderer.setSize(window.innerWidth, window.innerHeight)
    //edl渲染会需要改变渲染不同画面和顺序，因此需手动clear
    renderer.autoClear = false
    document.body.appendChild(renderer.domElement)

    //平移控制，是使用box盒的
    const transformControl = new TransformControls(camera, renderer.domElement)
    transformControl.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value
    })
    scene.add(transformControl)

    store.viewer = {
        camera,
        scene,
        renderer,
        transformControl,
    }

    const controls = new OrbitControls(camera, renderer.domElement)

    //跟随球
    const geo = new SphereGeometry(1, 64, 64)
    const mat = new MeshBasicMaterial({
        color: 0xffffff,
    })
    const sph = new Mesh(geo, mat)
    scene.add(sph)

    //固定位置球
    const sph2 = new Mesh(geo, mat)
    sph2.position.set(1, 1, 2)
    scene.add(sph2)
    store.sph = sph

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
        edlRenderer.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize, false)

    // Manages the necessary state for loading/updating one or more point clouds.
    const potree = new Potree()
    potree.pointBudget = 20000000

    const pointClouds = []
    store.pointClouds = pointClouds

    const edlRenderer = new EdlRenderer(renderer, pointClouds)

    const baseUrl = './pointcloud/'
    potree
        .loadPointCloud(
            // The name of the point cloud which is to be loaded.
            'cloud.js',
            // Given the relative URL of a file, should return a full URL (e.g. signed).
            //example : baseUrl = './pointcloud/'
            //`${baseUrl}${relativeUrl}`=> './pointcloud/cloud.js'
            (relativeUrl) => `${baseUrl}${relativeUrl}`
        )
        .then((pco) => {
            pointClouds.push(pco)
            scenePC.add(pco) // Add the loaded point cloud to your ThreeJS scene.

            // The point cloud comes with a material which can be customized directly.
            // Here we just set the size of the points.

            pco.material.pointSizeType = PointSizeType.ADAPTIVE

            renderer.domElement.addEventListener(
                'mousemove',
                handleMouseMove,
                false
            )
            renderer.domElement.addEventListener(
                'mouseup',
                handleMouseDown,
                false
            )

            generateClipBox(pco)
            pco.material.clipMode = ClipMode.CLIP_OUTSIDE
        })
    update()

    function update(t) {
        requestAnimationFrame(update)

        // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
        // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
        // number of visible points in check.
        potree.updatePointClouds(pointClouds, camera, renderer)
        controls.update()

        if (pointClouds.length) {
            const [pco] = pointClouds
            const { clipBoxes } = store
            // console.log('object :>> ', clipBoxes)
            clipBoxes.forEach((clipbox) => {
                const box = clipbox.box
                clipbox.inverse = new THREE.Matrix4().getInverse(
                    box.matrixWorld
                )
                clipbox.boxPosition = box.getWorldPosition(new THREE.Vector3())
                clipbox.matrix = box.matrixWorld
            })
            pco.material.setClipBoxes(clipBoxes)
        }

        //清空画布，并渲染背景（如果是纯色也可选择用renderer的clearcolor作为背景）
        renderer.clear()
        renderer.render(sceneBG, camera)

        //渲染点云，可切换
        if (isUseEdl) {
            edlRenderer.render(scenePC, camera)
        } else {
            renderer.render(scenePC, camera)
        }

        //渲染一般物体（非点云）
        renderer.render(scene, camera)
        // }
    }
}
export default init
