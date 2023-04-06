import {useEffect} from 'react'
import {MathUtils} from 'three'
import {useGLTF} from '@react-three/drei'
import {useThree} from '@react-three/fiber'
import {useAmmoPhysicsContext} from 'use-ammojs'
import {isVector3Arr, mergeModelMeshes} from '../utils/common'
import {DEFAULT_SOFTBODY_OPTIONS} from '../utils/constants'
import {assertDefined} from '../utils/custom.assert'


export const AmmoSoftGLTF = ({url, softBodyOptions, customMaterial, position, rotation, scale}) => {
  assertDefined(url)
  const gltf = useGLTF(url)
  const three = useThree()
  const apc = useAmmoPhysicsContext()

  useEffect(() => {
    const mergedMesh = mergeModelMeshes(gltf.scene, customMaterial)
    if (isVector3Arr(position)) {
      mergedMesh.position.set(position[0], position[1], position[2])
    }
    if (isVector3Arr(rotation)) {
      mergedMesh.rotation.set(rotation[0], rotation[1], rotation[2])
    }
    if (isVector3Arr(scale)) {
      mergedMesh.scale.set(scale[0], scale[1], scale[2])
    }
    three.scene.add(mergedMesh)
    const newUUID = MathUtils.generateUUID()
    const options = softBodyOptions ? softBodyOptions : DEFAULT_SOFTBODY_OPTIONS
    apc.addSoftBody(
        newUUID,
        mergedMesh,
        options,
    )
  }, [apc, customMaterial, gltf.scene, position, rotation, scale, softBodyOptions, three.scene])
}