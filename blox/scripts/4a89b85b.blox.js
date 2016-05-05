var Vertex=augment(Object,function(a){return{constructor:function(a,b,c,d,e,f){this.x=a,this.y=b,this.z=c,this.normal=d||new THREE.Vector3,this.uv=e||new THREE.Vector2,this.facing=f||0},clone:function(){return new Vertex(this.x,this.y,this.z,this.normal.clone(),this.uv.clone(),this.facing)},add:function(a){return this.x+=a.x,this.y+=a.y,this.z+=a.z,this},subtract:function(a){return this.x-=a.x,this.y-=a.y,this.z-=a.z,this},multiplyScalar:function(a){return this.x*=a,this.y*=a,this.z*=a,this},cross:function(a){var b=this.x,c=this.y,d=this.z;return this.x=c*a.z-d*a.y,this.y=d*a.x-b*a.z,this.z=b*a.y-c*a.x,this},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);return this.x/=a,this.y/=a,this.z/=a,this},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lerp:function(a,b){return this.add(a.clone().subtract(this).multiplyScalar(b)),this.normal.add(a.normal.clone().sub(this.normal).multiplyScalar(b)),this.uv.add(a.uv.clone().sub(this.uv).multiplyScalar(b)),this},interpolate:function(a,b){return this.clone().lerp(a,b)},applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z,e=a.elements;return this.x=e[0]*b+e[4]*c+e[8]*d+e[12],this.y=e[1]*b+e[5]*c+e[9]*d+e[13],this.z=e[2]*b+e[6]*c+e[10]*d+e[14],this},flagPositive:function(){this.facing=1},flagNegative:function(){this.facing=-1},getFacing:function(){return this.facing}}}),Polygon=augment(Object,function(a){var b=1e-5,c=0,d=1,e=2,f=3;return{constructor:function(a){a instanceof Array||(a=[]),this.vertices=a,a.length>0?this.calculateProperties():this.normal=this.w=void 0,this.facing=0,this.originalFace=null},calculateProperties:function(a){var b=this.vertices[0],c=this.vertices[1],d=this.vertices[2];return this.normal=c.clone().subtract(b).cross(d.clone().subtract(b)).normalize(),this.w=this.normal.clone().dot(b),a&&(this.facing=a.facing,this.originalFace=a.originalFace),this},clone:function(){var a,b,c=new Polygon;for(a=0,b=this.vertices.length;b>a;a++)c.vertices.push(this.vertices[a].clone());return c.calculateProperties(),c.facing=this.facing,c.originalFace=this.originalFace,c},flip:function(){var a,b=[];for(this.normal.multiplyScalar(-1),this.w*=-1,a=this.vertices.length-1;a>=0;a--)b.push(this.vertices[a]);return this.vertices=b,this},classifyVertex:function(a){var f=this.normal.dot(a)-this.w;return-b>f?e:f>b?d:c},classifySide:function(a){var b,g,h,i=0,j=0,k=a.vertices.length;for(b=0;k>b;b++)g=a.vertices[b],h=this.classifyVertex(g),h===d?i++:h===e&&j++;return i>0&&0===j?d:0===i&&j>0?e:0===i&&0===j?c:f},splitPolygon:function(a,b,g,h,i){var j=this.classifySide(a);if(j===c)(this.normal.dot(a.normal)>0?b:g).push(a);else if(j===d)h.push(a);else if(j===e)i.push(a);else{var k,l,m,n,o,p,q,r,s,t=[],u=[];for(l=0,k=a.vertices.length;k>l;l++)m=(l+1)%k,p=a.vertices[l],q=a.vertices[m],n=this.classifyVertex(p),o=this.classifyVertex(q),n!=e&&t.push(p),n!=d&&u.push(p),(n|o)===f&&(r=(this.w-this.normal.dot(p))/this.normal.dot(q.clone().subtract(p)),s=p.interpolate(q,r),t.push(s),u.push(s));t.length>=3&&h.push(new Polygon(t).calculateProperties(a)),u.length>=3&&i.push(new Polygon(u).calculateProperties(a))}},flagPositive:function(){this.facing=1,this.vertices.forEach(function(a){a.flagPositive()})},flagNegative:function(){this.facing=-1,this.vertices.forEach(function(a){a.flagNegative()})},getFacing:function(){var a=[this.facing,0];return this.vertices.forEach(function(b){a[1]+=b.getFacing()}),a[0]+a[1]}}}),Node=augment(Object,function(a){var b=2;return{constructor:function(a){var b,c,d=[],e=[];if(this.polygons=[],this.front=this.back=void 0,a instanceof Array&&0!==a.length){for(this.divider=a[0].clone(),b=0,c=a.length;c>b;b++)this.divider.splitPolygon(a[b],this.polygons,this.polygons,d,e);d.length>0&&(this.front=new Node(d)),e.length>0&&(this.back=new Node(e))}},isConvex:function(a){var c,d;for(c=0;c<a.length;c++)for(d=0;d<a.length;d++)if(c!==d&&a[c].classifySide(a[d])!==b)return!1;return!0},build:function(a){var b,c,d=[],e=[];for(this.divider||(this.divider=a[0].clone()),b=0,c=a.length;c>b;b++)this.divider.splitPolygon(a[b],this.polygons,this.polygons,d,e);d.length>0&&(this.front||(this.front=new Node),this.front.build(d)),e.length>0&&(this.back||(this.back=new Node),this.back.build(e))},allPolygons:function(){var a=this.polygons.slice();return this.front&&(a=a.concat(this.front.allPolygons())),this.back&&(a=a.concat(this.back.allPolygons())),a},clone:function(){var a=new Node;return a.divider=this.divider.clone(),a.polygons=this.polygons.map(function(a){return a.clone()}),a.front=this.front&&this.front.clone(),a.back=this.back&&this.back.clone(),a},invert:function(){var a,b,c;for(a=0,b=this.polygons.length;b>a;a++)this.polygons[a].flip();return this.divider.flip(),this.front&&this.front.invert(),this.back&&this.back.invert(),c=this.front,this.front=this.back,this.back=c,this},clipPolygons:function(a){var b,c,d,e;if(!this.divider)return a.slice();for(d=[],e=[],b=0,c=a.length;c>b;b++)this.divider.splitPolygon(a[b],d,e,d,e);return this.front&&(d=this.front.clipPolygons(d)),e=this.back?this.back.clipPolygons(e):[],d.concat(e)},clipTo:function(a){this.polygons=a.clipPolygons(this.polygons),this.front&&this.front.clipTo(a),this.back&&this.back.clipTo(a)},flagPositive:function(){this.allPolygons().forEach(function(a){a.flagPositive()})},flagNegative:function(){this.allPolygons().forEach(function(a){a.flagNegative()})},getFacing:function(){var a="";return this.allPolygons().forEach(function(b){a+=(a?".":"")+b.getFacing()}),a}}}),CSG=augment(Object,function(a){return{constructor:function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n=[];if(a instanceof THREE.Geometry)this.matrix=new THREE.Matrix4;else{if(!(a instanceof THREE.Mesh)){if(a instanceof Node)return this.tree=a,this.matrix=new THREE.Matrix4,this;throw"CSG: Given geometry is unsupported"}k=a,k.updateMatrix(),this.matrix=k.matrix.clone(),l=k.material,a=k.geometry}for(b=0,c=a.faces.length;c>b;b++){for(g=a.faces[b],i=a.faceVertexUvs[0][b],m=new Polygon,m.originalFace=g,l instanceof THREE.MultiMaterial?g._material=(l.materials||[])[g.materialIndex]:g._material=l,d=0,e=i.length;3>d;d+=1)f=g[["a","b","c","d"][d]],h=a.vertices[f],j=i?new THREE.Vector2(i[d].x,i[d].y):null,h=new Vertex(h.x,h.y,h.z,g.vertexNormals[d],j),h.applyMatrix4(this.matrix),m.vertices.push(h);m.calculateProperties(),n.push(m)}this.tree=new Node(n)},subtract:function(a){var b=this.tree.clone(),c=a.tree.clone();return b.flagPositive(),c.flagNegative(),b.invert(),b.clipTo(c),c.clipTo(b),c.invert(),c.clipTo(b),c.invert(),b.build(c.allPolygons()),b.invert(),b=new CSG(b),b.matrix=this.matrix,b},union:function(a){var b=this.tree.clone(),c=a.tree.clone();return b.clipTo(c),c.clipTo(b),c.invert(),c.clipTo(b),c.invert(),b.build(c.allPolygons()),b=new CSG(b),b.matrix=this.matrix,b},intersect:function(a){var b=this.tree.clone(),c=a.tree.clone();return b.invert(),c.clipTo(b),c.invert(),b.clipTo(c),c.clipTo(b),b.build(c.allPolygons()),b.invert(),b=new CSG(b),b.matrix=this.matrix,b},toGeometry:function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n=(new THREE.Matrix4).getInverse(this.matrix),o=new THREE.Geometry,p=this.tree.allPolygons(),q=p.length,r={};for(a=0;q>a;a++)for(d=p[a],e=d.vertices.length,f=d.getFacing()<0?-1:1,b=2;e>b;b++){for(l=[],m=[],i=[],c=0;3>c;c++)h=[0,b-1,b][c],j=d.vertices[h],l.push(new THREE.Vector2(j.uv.x,j.uv.y)),g=j.normal,m.push(new THREE.Vector3(g.x*f,g.y*f,g.z*f)),j=new THREE.Vector3(j.x,j.y,j.z),j.applyMatrix4(n),"undefined"!=typeof r[j.x+","+j.y+","+j.z]?i[c]=r[j.x+","+j.y+","+j.z]:(o.vertices.push(j),i[c]=r[j.x+","+j.y+","+j.z]=o.vertices.length-1);k=new THREE.Face3(i[0],i[1],i[2],new THREE.Vector3(d.normal.x,d.normal.y,d.normal.z)),k.vertexNormals=m,k._material=d.originalFace?d.originalFace._material:k._material,o.faces.push(k),o.faceVertexUvs[0].push(l)}return o},toMesh:function(){var a=this.toGeometry(),b=new THREE.MultiMaterial,c=new THREE.Mesh(a,b);c.position.setFromMatrixPosition(this.matrix),c.rotation.setFromRotationMatrix(this.matrix);var d=[];return c.geometry.faces.forEach(function(a){var b=a._material,c=d.indexOf(b);0>c&&(c=d.length,d.push(b)),a.materialIndex=c,delete a._material}),c.material.materials=d,c}}}),BLOX=new function(){var a=Math.PI/180,b=16746496,c=function(a){console.error("BLOX: "+a)};this.toMesh=function(d){var e;if(d.shape)var f=({sphere:function(){return new THREE.SphereGeometry(d.radius,16,12)},box:function(){return new THREE.BoxGeometry(d.x,d.y,d.z)},cylinder:function(){return new THREE.CylinderGeometry(d.top,d.bottom,d.height,16)}}[d.shape]||function(){c('Shape "'+d.shape+'" not supported, use sphere, box or cylinder.')})();if(f){var g=new THREE.MeshPhongMaterial({color:d.color||b,vertexColors:THREE.VertexColors});e=new THREE.Mesh(f,g)}if(d.subtract){var h=[];d.subtract.forEach(function(a){var b=BLOX.toMesh(a);b&&h.push(new CSG(b))});var i,j=e?new CSG(e):null;if(j||(j=h.shift()),h.length){h.forEach(function(a,b){i=i?i.union(a):a});var k=j.subtract(i);e=k.toMesh()}else e=j?j.toMesh():e}else if(d.union){var h=[];d.union.forEach(function(a){var b=BLOX.toMesh(a);b&&h.push(new CSG(b))});var j=e?new CSG(e):null,i=j;h.forEach(function(a,b){i=i?i.union(a):a}),e=i.toMesh()}else if(d.intersect){var h=[];d.intersect.forEach(function(a){var b=BLOX.toMesh(a);b&&h.push(new CSG(b))});var j=e?new CSG(e):null,l=j;h.forEach(function(a){l=l?l.intersect(a):a}),e=l.toMesh()}return e&&d.ops&&d.ops.forEach(function(b){if(b.scale&&e.geometry.scale.apply(e.geometry,b.scale),b.rotate){var c=b.rotate;c[0]&&e.geometry.rotateX(c[0]*a),c[1]&&e.geometry.rotateY(c[1]*a),c[2]&&e.geometry.rotateZ(c[2]*a)}b.translate&&e.geometry.translate.apply(e.geometry,b.translate)}),e},this.toGeometry=function(a){return this.toMesh(a).geometry}};