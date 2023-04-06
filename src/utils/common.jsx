import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils'
import {Matrix4, Mesh} from 'three'
import {customDebug} from './custom.debug'


export const mergeModelMeshes = (model, customMaterial) => {
  const bufferGeometries = []
  const materials = []
  const matrix4 = new Matrix4()

  model.traverse((child) => {
    if (child.isMesh) {
      customDebug().log('common#mergeModelMeshes: child mesh info: ', child.position, child.quaternion, child.scale)

      if (child.geometry?.isBufferGeometry) {
        matrix4.compose(child.position, child.quaternion, child.scale)
        child.geometry.applyMatrix4(matrix4)
        bufferGeometries.push(child.geometry)
      }

      if (child.material?.isMaterial) {
        materials.push(child.material)
      }
    }
  })

  const material = customMaterial ? customMaterial : materials
  const useGroups = Array.isArray(material)
  customDebug().log('common#mergeModelMeshes: bufferGeometries: ', bufferGeometries)
  customDebug().log('common#mergeModelMeshes: material: ', material)
  const mergedBufferGeometry = mergeBufferGeometries(bufferGeometries, useGroups)
  mergedBufferGeometry.computeBoundingBox()
  const mergedMesh = new Mesh(mergedBufferGeometry, material)
  return mergedMesh
}


export const isVector3Arr = (arr) => {
  return Array.isArray(arr) && arr.length === 3
}
