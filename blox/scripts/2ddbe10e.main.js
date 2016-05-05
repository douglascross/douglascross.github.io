function init(){camera=new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1e5),camera.position.z=1e3,camera.position.x=0,camera.position.y=0,camera.lookAt({x:0,y:0,z:0}),scene=new THREE.Scene,renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(renderer.domElement),window.addEventListener("resize",onWindowResize,!1),renderer.shadowMap.enabled=!0,renderer.shadowMap.soft=!0,renderer.shadowMap.type=THREE.PCFSoftShadowMap;var a=new THREE.DirectionalLight(13421772,1);a.position.set(0,0,1200),a.castShadow=!0,a.shadow.darkness=.2,a.shadow.mapSize.width=512,a.shadow.mapSize.height=512,a.shadow.camera.near=200,a.shadow.camera.far=2e3;var b=800;a.shadow.camera.left=-b,a.shadow.camera.right=b,a.shadow.camera.top=b,a.shadow.camera.bottom=-b;new THREE.CameraHelper(a.shadow.camera);scene.add(a);var c=new THREE.AmbientLight(3355443);scene.add(c);var d=((new THREE.TextureLoader).load("images/Cliffs0193_2_S.jpg"),new THREE.MeshPhongMaterial({color:16746496})),e=new THREE.MeshPhongMaterial({color:16777215,emissive:10066329}),f=new THREE.Mesh(new THREE.PlaneGeometry(3e3,3e3),e);f.position.z=-120,f.receiveShadow=!0,scene.add(f);var g=[subtract1,subtract2,subtract3,subtract4,boxPart,sphereWithBox,cylindersPart,finalStandard,colorExample.boxPart,colorExample.sphereWithBox,colorExample.cylindersPart,colorExample.finalStandard],h=16,i=Math.ceil(Math.pow(h,.5)),j=1e3/i,k=j*(i/2-.5),l=j/300;g.forEach(function(a,b){a=_.cloneDeep(a);var c=Math.floor(b/i),e=b%i,f=BLOX.toMesh(a);f||(f=new THREE.Mesh(BLOX.toGeometry(a),d)),shapes.push(f),f.castShadow=!0,f.scale.x=l,f.scale.y=l,f.scale.z=l,f.position.x=-k+e*j,f.position.y=k-c*j,scene.add(f)})}function onWindowResize(){camera.aspect=window.innerWidth/window.innerHeight,camera.updateProjectionMatrix(),renderer.setSize(window.innerWidth,window.innerHeight)}function animate(){requestAnimationFrame(animate),shapes.forEach(function(a){a.rotation.x+=.005,a.rotation.y+=.01}),renderer.render(scene,camera)}var subtract1={shape:"box",x:200,y:200,z:200,subtract:[{shape:"sphere",radius:120,ops:[{scale:[2,1,1]}]}],ops:[{scale:[.5,1,1]}]},subtract2={shape:"sphere",radius:120,subtract:[{shape:"box",x:200,y:200,z:200,ops:[{scale:[2,1,1]}]}],ops:[{scale:[.5,1,1]}]},subtract3={shape:"box",x:200,y:200,z:200,subtract:[{shape:"box",x:120,y:120,z:120,ops:[{scale:[2,1,1]}]}],ops:[{scale:[.5,1,1]}]},subtract4={shape:"sphere",radius:120,subtract:[{shape:"sphere",radius:110,ops:[{translate:[50,0,0]}]}],ops:[{scale:[.5,1,1]}]},spherePart={shape:"sphere",radius:135},boxPart={shape:"box",x:200,y:200,z:200},sphereWithBox={intersect:[spherePart,boxPart]},cylinderPart={shape:"cylinder",top:70,bottom:70,height:240},cylindersPart={union:[{shape:"cylinder",top:70,bottom:70,height:200},{shape:"cylinder",top:70,bottom:70,height:200,ops:[{rotate:[90,0,0]}]},{shape:"cylinder",top:70,bottom:70,height:200,ops:[{rotate:[90,90,0]}]}]},finalStandard={subtract:[sphereWithBox,cylindersPart]},colorExample={spherePart:{shape:"sphere",radius:135,color:255},boxPart:{shape:"box",x:200,y:200,z:200,color:16711680},cylinderPart:{shape:"cylinder",top:70,bottom:70,height:200,color:65280}};colorExample.sphereWithBox={intersect:[colorExample.spherePart,colorExample.boxPart]},colorExample.cylindersPart={union:[{shape:"cylinder",top:70,bottom:70,height:200,color:65280},{shape:"cylinder",top:70,bottom:70,height:200,color:65280,ops:[{rotate:[90,0,0]}]},{shape:"cylinder",top:70,bottom:70,height:200,color:65280,ops:[{rotate:[90,90,0]}]}],color:65280},colorExample.finalStandard={subtract:[colorExample.sphereWithBox,colorExample.cylindersPart]};var camera,scene,renderer,shapes=[];init(),animate();