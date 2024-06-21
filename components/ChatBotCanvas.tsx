// @ts-nocheck
"use client";
import { AppContext } from "../app/context/IsPlayingContext";
import {
	Environment,
	Html,
	Loader,
	OrbitControls,
	useTexture,
	SpotLight,
	useFBX,
	useAnimations,
	useDepthBuffer,
	useGLTF,
	OrthographicCamera
	, PerspectiveCamera
} from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three';
import { LinearEncoding, sRGBEncoding } from 'three/src/constants';
import { LineBasicMaterial, MeshPhysicalMaterial, Vector2 } from 'three';
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Vector3 } from "three";
import createAnimation from './converter';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial';
import blinkData from './blendDataBlink.json';
const _ = require('lodash');


const Torch = ({ vec = new Vector3(), ...props }) => {
	const light = useRef<THREE.SpotLight>(null);
	const viewport = useThree((state) => state.viewport);
	useFrame((state) => {
		light.current?.target.position.lerp(
			vec.set(
				(state.mouse.x * viewport.width) / 2,
				(state.mouse.y * viewport.height) / 2,
				0
			),
			0.1
		);
		light.current?.target.updateMatrixWorld();
	});
	return (
		<SpotLight
			castShadow
			ref={light}
			penumbra={1}
			distance={10}
			angle={0.35}
			attenuation={5}
			anglePower={4}
			intensity={3}
			{...props}
		/>
	);
};

interface AvatarProps {
	avatar_url: string;
	speak: boolean;
	setSpeak: React.Dispatch<React.SetStateAction<boolean>>;
	text: string;
	setAudioSource: React.Dispatch<React.SetStateAction<string | null>>;
	playing: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
	avatar_url,
	speak,
	setSpeak,
	text,
	setAudioSource,
	playing
}) => {

	let gltf = useGLTF(avatar_url);
	let mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf.scene]);

	let morphTargetDictionaryBody: { [key: string]: number } | null = null;
	let morphTargetDictionaryLowerTeeth: { [key: string]: number } | null = null;

	const [
		bodyTexture,
		eyesTexture,
		teethTexture,
		bodySpecularTexture,
		bodyRoughnessTexture,
		bodyNormalTexture,
		teethNormalTexture,
		// teethSpecularTexture,
		hairTexture,
		tshirtDiffuseTexture,
		tshirtNormalTexture,
		tshirtRoughnessTexture,
		hairAlphaTexture,
		hairNormalTexture,
		hairRoughnessTexture,
	] = useTexture([
		"./images/body.webp",
		"./images/eyes.webp",
		"./images/teeth_diffuse.webp",
		"./images/body_specular.webp",
		"./images/body_roughness.webp",
		"./images/body_normal.webp",
		"./images/teeth_normal.webp",
		// "../images/teeth_specular.webp",
		"./images/h_color.webp",
		"./images/tshirt_diffuse.webp",
		"./images/tshirt_normal.webp",
		"./images/tshirt_roughness.webp",
		"./images/h_alpha.webp",
		"./images/h_normal.webp",
		"./images/h_roughness.webp",
	]);

	_.each([
		bodyTexture,
		eyesTexture,
		teethTexture,
		teethNormalTexture,
		bodySpecularTexture,
		bodyRoughnessTexture,
		bodyNormalTexture,
		tshirtDiffuseTexture,
		tshirtNormalTexture,
		tshirtRoughnessTexture,
		hairAlphaTexture,
		hairNormalTexture,
		hairRoughnessTexture
	], t => {
		t.encoding = sRGBEncoding;
		t.flipY = false;
	});

	bodyNormalTexture.encoding = LinearEncoding;
	tshirtNormalTexture.encoding = LinearEncoding;
	teethNormalTexture.encoding = LinearEncoding;
	hairNormalTexture.encoding = LinearEncoding;


	gltf.scene.traverse(node => {


		if (node.type === 'Mesh' || node.type === 'LineSegments' || node.type === 'SkinnedMesh') {

			node.castShadow = true;
			node.receiveShadow = true;
			node.frustumCulled = false;


			if (node.name.includes("Body")) {

				node.castShadow = true;
				node.receiveShadow = true;

				node.material = new MeshPhysicalMaterial();
				node.material.map = bodyTexture;
				// node.material.shininess = 60;
				node.material.roughness = 1.7;

				// node.material.specularMap = bodySpecularTexture;
				node.material.roughnessMap = bodyRoughnessTexture;
				node.material.normalMap = bodyNormalTexture;
				node.material.normalScale = new Vector2(0.6, 0.6);

				morphTargetDictionaryBody = node.morphTargetDictionary;

				node.material.envMapIntensity = 0.8;
				// node.material.visible = false;

			}

			if (node.name.includes("Eyes")) {
				node.material = new MeshStandardMaterial();
				node.material.map = eyesTexture;
				// node.material.shininess = 100;
				node.material.roughness = 0.1;
				node.material.envMapIntensity = 0.5;


			}

			if (node.name.includes("Brows")) {
				node.material = new LineBasicMaterial({ color: 0x000000 });
				node.material.linewidth = 1;
				node.material.opacity = 0.5;
				node.material.transparent = true;
				node.visible = false;
			}

			if (node.name.includes("Teeth")) {

				node.receiveShadow = true;
				node.castShadow = true;
				node.material = new MeshStandardMaterial();
				node.material.roughness = 0.1;
				node.material.map = teethTexture;
				node.material.normalMap = teethNormalTexture;

				node.material.envMapIntensity = 0.7;


			}

			if (node.name.includes("Hair")) {
				node.material = new MeshStandardMaterial();
				node.material.map = hairTexture;
				node.material.alphaMap = hairAlphaTexture;
				node.material.normalMap = hairNormalTexture;
				node.material.roughnessMap = hairRoughnessTexture;

				node.material.transparent = true;
				node.material.depthWrite = false;
				node.material.side = 2;
				node.material.color.setHex(0x000000);

				node.material.envMapIntensity = 0.3;


			}

			if (node.name.includes("TSHIRT")) {
				node.material = new MeshStandardMaterial();

				node.material.map = tshirtDiffuseTexture;
				node.material.roughnessMap = tshirtRoughnessTexture;
				node.material.normalMap = tshirtNormalTexture;
				node.material.color.setHex(0xffffff);

				node.material.envMapIntensity = 0.5;


			}

			if (node.name.includes("TeethLower")) {
				morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
			}

		}

	});

	const [clips, setClips] = useState([]);


	useEffect(() => {
		if (speak === false) return;

		// Generate random speaking animation
		const duration = 5; // Duration in seconds
		const fps = 60;
		const frameCount = duration * fps;
		const blendData = [];

		for (let i = 0; i < frameCount; i++) {
			blendData.push({
				time: i / fps,
				blendshapes: {
					jawOpen: Math.random() * 0.2,
					mouthClose: Math.random() * 0.1,
					mouthFunnel: Math.random() * 0.1,
					mouthPucker: Math.random() * 0.1,
					tongueOut: Math.random() * 0.1,
				}
			});
		}

		if (morphTargetDictionaryBody && morphTargetDictionaryLowerTeeth) {
			let newClips = [
				createAnimation(blendData, morphTargetDictionaryBody, 'HG_Body'),
				createAnimation(blendData, morphTargetDictionaryLowerTeeth, 'HG_TeethLower')
			];

			newClips.forEach(clip => {
				if (clip) {
					let clipAction = mixer.clipAction(clip);
					clipAction.setLoop(THREE.LoopOnce);
					clipAction.play();
				}
			});
		}

	}, [speak, mixer, morphTargetDictionaryBody, morphTargetDictionaryLowerTeeth]);

	useFrame((state, delta) => {
		mixer.update(delta);
	});

	return (
		<group name="avatar">
			<primitive object={gltf.scene} dispose={null} />
		</group>
	);
}

const STYLES = {
	area: { position: 'absolute', bottom: '10px', left: '10px', zIndex: 500 },
	text: { margin: '0px', width: '300px', padding: '5px', background: 'none', color: '#ffffff', fontSize: '1.2em', border: 'none' },
	speak: { padding: '10px', marginTop: '5px', display: 'block', color: '#FFFFFF', background: '#222222', border: 'None' },
	area2: { position: 'absolute', top: '5px', right: '15px', zIndex: 500 },
	label: { color: '#777777', fontSize: '0.8em' }
}


//Resource to Head : https://sketchfab.com/3d-models/blender-sushi-virtual-journal-16th-april-2020-634af2ae983f4fb8a9295e6b1b3d5c74
const Head = () => {
	const { isPlaying, setIsPlaying } = useContext(AppContext);
	const model = useGLTF("/model.glb");

	const animations = useAnimations(model.animations, model.scene);
	const action = animations.actions.Animation;
	const depthBuffer = useDepthBuffer({ frames: 1 });
	useEffect(() => {
		if (isPlaying) {
			action?.play();
		} else {
			action?.fadeOut(0.5);
			setTimeout(() => {
				action?.stop();
			}, 500);
		}
	}, [isPlaying, action]);

	return (
		<>
			<primitive object={model.scene} scale={3} rotation-z={0.2} />
			<Torch
				depthBuffer={depthBuffer}
				color="blue"
				position={[3, 2, 2]}
			/>
			<Torch
				depthBuffer={depthBuffer}
				color="#b00c3f"
				position={[-3, 2, 2]}
			/>
		</>
	);
};


function Bg() {

	const texture = useTexture('./images/bg.webp');

	return (
		<mesh position={[0, 1.5, -2]} scale={[0.8, 0.8, 0.8]}>
			<planeBufferGeometry />
			<meshBasicMaterial map={texture} />

		</mesh>
	)

}
interface ChatBotCanvasProps {
	speak: boolean;
	text: string;
	setSpeak: React.Dispatch<React.SetStateAction<boolean>>;
	audioSource: string | null;
	setAudioSource: React.Dispatch<React.SetStateAction<string | null>>;
	playing: boolean;
	setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}


export const ChatBotCanvas: React.FC<ChatBotCanvasProps> = ({
	speak,
	text,
	setSpeak,
	audioSource,
	setAudioSource,
	playing,
	setPlaying
}) => {
	const audioPlayer = useRef();




	return (
		<Canvas style={{ width: '100%', height: '100%' }} dpr={2} onCreated={(ctx) => {
			ctx.gl.physicallyCorrectLights = true;
		}}>
			<OrthographicCamera
				makeDefault
				zoom={500}
				position={[0, 1.65, 1]}
			/>
			{/* <PerspectiveCamera makeDefault position={[0, 0, 5]} /> */}


			{/* <OrbitControls
				enableZoom={false}
				enableDamping
				maxPolarAngle={2}
				minAzimuthAngle={-Math.PI * 0.5}
				maxAzimuthAngle={Math.PI * 0.5}
			/> */}
			<color attach="background" args={["#f0f0f0"]} />
			<ambientLight intensity={0.015} />
			<Suspense fallback={null}>
				<Environment background={false} files="./images/photo_studio_loft_hall_1k.hdr" />
			</Suspense>

			<Suspense fallback={null}>
				<Bg />
			</Suspense>

			<Suspense fallback={null}></Suspense>
			<Suspense fallback={null}>
				<Avatar
					// scale={[0.5, 0.5, 0.5]} // Adjust this scale to fit your model in the view
					// position={[0, -1, 0]}
					avatar_url="/model.glb"
					speak={speak}
					setSpeak={setSpeak}
					text={text}
					setAudioSource={setAudioSource}
					playing={playing}
				/>

			</Suspense>
		</Canvas>
	);
};
