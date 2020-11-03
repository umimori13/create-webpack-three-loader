import { PointCloudOctree, Potree } from '@pnext/three-loader'
import store from './store'
import { Box3Helper, Matrix4, Mesh, Raycaster, Box3, Vector3 } from 'three'
import * as THREE from 'three'

const handleMouseDown = (event) => {
    const [x, y] = [event.pageX, event.pageY]
    const { pointClouds, viewer } = store
    const { camera, renderer, scene } = viewer
    const point = mouseRay(x, y, pointClouds, renderer, camera)
    if (point) {
        const testBox = new Box3()
        const helper = new Box3Helper(
            point.pointCloud.getBoundingBoxWorld(),
            0xffff00
        )
    }
}

const handleMouseMove = (event) => {
    const [x, y] = [event.pageX, event.pageY]
    const { pointClouds, viewer } = store
    const { camera, renderer } = viewer
    const point = mouseRay(x, y, pointClouds, renderer, camera)
    const { sph } = store
    if (point) {
        sph.position.copy(point.position)
    }
}

/**
 *
 * @param {Number} x Mouse的x
 * @param {Number} y Mouse的y
 * @param {pointclouds} arr 点云
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Camera} camera
 * @param {Object} params 参数
 */
const mouseRay = (x, y, arr, renderer, camera, params = {}) => {
    let nmouse = {
        x: (x / renderer.domElement.clientWidth) * 2 - 1,
        y: -(y / renderer.domElement.clientHeight) * 2 + 1,
    }
    let pickParams = {}

    if (params.pickClipped) {
        pickParams.pickClipped = params.pickClipped
    }

    pickParams.x = x
    pickParams.y = renderer.domElement.clientHeight - y

    let raycaster = new Raycaster()
    raycaster.setFromCamera(nmouse, camera)
    let ray = raycaster.ray
    const pointCloud = Potree.pick(arr, renderer, camera, ray, pickParams)

    const point = pointCloud ?? null
    return point
}

export { handleMouseMove, handleMouseDown }
