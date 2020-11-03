import * as THREE from 'three'
import store from './store'
const generateClipBox = (pco) => {
    const { scene, transformControl } = store.viewer
    const { clipBoxes } = store
    //此处大括号仅为了方便折叠和相同命名冲突，平时并不推荐使用
    {
        //造个盒子
        let boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        boxGeometry.computeBoundingBox()
        let boxFrameGeometry = new THREE.Geometry()
        {
            // bottom
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            // top
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            // sides
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
        }

        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            depthTest: true,
            depthWrite: false,
        })
        const box = new THREE.Mesh(boxGeometry, material)
        box.scale.set(10, 10, 10)
        box.updateMatrix()
        box.updateMatrixWorld()
        scene.add(box)

        let boxInverse = new THREE.Matrix4().getInverse(box.matrixWorld)
        let boxPosition = box.getWorldPosition(new THREE.Vector3())
        const clipBox = {
            box,
            inverse: boxInverse,
            matrix: box.matrixWorld,
            position: boxPosition,
        }
        clipBoxes.push(clipBox)
        pco.material.setClipBoxes(clipBoxes)
        transformControl.attach(box)
    }
    {
        let boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        boxGeometry.computeBoundingBox()
        let boxFrameGeometry = new THREE.Geometry()
        {
            // bottom
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            // top
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            // sides
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, 0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(0.5, 0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, -0.5, -0.5))
            boxFrameGeometry.vertices.push(new THREE.Vector3(-0.5, 0.5, -0.5))
        }
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.3,
            depthTest: true,
            depthWrite: false,
        })
        const box = new THREE.Mesh(boxGeometry, material)
        box.geometry.computeBoundingBox()
        const boundingBox = box.geometry.boundingBox
        const frame = new THREE.LineSegments(
            boxFrameGeometry,
            new THREE.LineBasicMaterial({ color: 0x000000 })
        )
        box.scale.set(20, 20, 10)
        box.position.set(10, 10, 0)
        box.updateMatrix()
        box.updateMatrixWorld()
        frame.scale.set(20, 20, 10)
        frame.position.set(10, 10, 0)
        scene.add(box)
        scene.add(frame)
        // const box = new Mesh
        let boxInverse = new THREE.Matrix4().getInverse(box.matrixWorld)
        let boxPosition = box.getWorldPosition(new THREE.Vector3())
        const clipBox = {
            box,
            inverse: boxInverse,
            matrix: box.matrixWorld,
            position: boxPosition,
        }
        clipBoxes.push(clipBox)
        pco.material.setClipBoxes(clipBoxes)
    }
}
export default generateClipBox
