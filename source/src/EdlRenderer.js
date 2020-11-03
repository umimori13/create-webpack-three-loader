import * as THREE from 'three'
import { EyeDomeLightingMaterial } from './EdlMaterial'

class EdlRenderer {
    constructor(renderer, pointClouds) {
        this.renderer = renderer
        this.edlMaterial = null
        this.pointClouds = pointClouds
        this.screenPass = new (function () {
            this.screenScene = new THREE.Scene()
            this.screenQuad = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2, 2, 0)
            )
            this.screenQuad.material.depthTest = true
            this.screenQuad.material.depthWrite = true
            this.screenQuad.material.transparent = true
            this.screenScene.add(this.screenQuad)
            this.camera = new THREE.Camera()

            this.render = function (renderer, material, camera, target) {
                this.screenQuad.material = material
                if (typeof target === 'undefined') {
                    renderer.render(this.screenScene, this.camera)
                } else {
                    renderer.render(this.screenScene, this.camera, target)
                }
            }
        })()
    }

    clear() {
        const renderer = this.renderer
        const oldTarget = renderer.getRenderTarget()

        renderer.setRenderTarget(this.rtEDL)
        renderer.clear()

        renderer.setRenderTarget(oldTarget)
    }

    initEDL() {
        if (this.edlMaterial != null) {
            return
        }

        this.edlMaterial = new EyeDomeLightingMaterial()
        this.edlMaterial.depthTest = true
        this.edlMaterial.depthWrite = true
        this.edlMaterial.transparent = true
        this.edlMaterial.extensions.fragDepth = true

        this.rtEDL = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
                depthTexture: new THREE.DepthTexture(
                    undefined,
                    undefined,
                    THREE.UnsignedIntType
                ),
            }
        )
    }

    resize(width, height) {
        this.rtEDL.setSize(width, height)
    }

    render(scenePC, camera) {
        const renderer = this.renderer
        this.initEDL()

        this.clear()

        renderer.setRenderTarget(this.rtEDL)
        renderer.render(scenePC, camera)

        renderer.setRenderTarget(null)

        for (const pco of this.pointClouds) {
            const material = pco.material
            material.weighted = false
            material.useLogarithmicDepthBuffer = false
            material.uniforms.visibleNodes.value =
                pco.material.visibleNodesTexture
            material.useEDL = true
            material.spacing =
                pco.pcoGeometry.spacing *
                Math.max(pco.scale.x, pco.scale.y, pco.scale.z)
            pco.material.pointSizeType = 0
        }

        const uniforms = this.edlMaterial.uniforms

        const { width, height } = renderer.getSize(new THREE.Vector2())

        uniforms.screenWidth.value = width
        uniforms.screenHeight.value = height

        let proj = camera.projectionMatrix
        let projArray = new Float32Array(16)
        projArray.set(proj.elements)

        uniforms.uNear.value = camera.near
        uniforms.uFar.value = camera.far
        uniforms.uEDLColor.value = this.rtEDL.texture
        // uniforms.uEDLDepth.value = this.rtEDL.depthTexture
        uniforms.uProj.value = projArray

        uniforms.edlStrength.value = 0.4
        uniforms.radius.value = 1.4
        uniforms.opacity.value = 1 // HACK

        this.screenPass.render(renderer, this.edlMaterial, camera)
    }
}

export default EdlRenderer
