var G = {} ;







THREE.DisplacementShader = {

	uniforms: {
            texture1: { type: "t", value: null },
            scale: { type: "f", value: 1.0 },
	},

	vertexShader: [

                        "varying vec2 vUv;",
                        "varying float noise;",
                        "varying vec3 fNormal;",
                        "uniform sampler2D texture1;",
                        "uniform float scale;",

                        "void main() {",

                            "vUv = uv;",
                            "fNormal = normal;",

                            "vec4 noiseTex = texture2D( texture1, vUv );",

                            "noise = noiseTex.r;",
                            //adding the normal scales it outward
                            //(normal scale equals sphere diameter)
                            "vec3 newPosition = position + normal * noise * scale;",

                            "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",

                        "}"

	].join("\n"),

	fragmentShader: [

			"varying vec2 vUv;",
                        "varying float noise;",
                        "varying vec3 fNormal;",

			"void main( void ) {",

                            // compose the colour using the normals then 
                            // whatever is heightened by the noise is lighter
                            "gl_FragColor = vec4( fNormal * noise, 1. );",

                        "}"

	].join("\n")

};






G.s1 = 
{

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },
		"angle":    { type: "f", value: 0.0 }

	},

	vertexShader: [
		//"precision mediump float;" ,
		//"varying vec2 vUv;",
		//"varying vec2 position;" ,
		//"precision mediump float;" ,
		//"varying vec2 positionx;" ,
		//"varying vec2 vUv;" ,
		//"void main() {",
			//"positionx = position;" ,
		//	"vUv = uv;",
		//	"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		//"}"


		"varying vec2 vUv;" ,
		"varying float noise;" ,

		"float turbulence( vec3 p )" ,
		"{" ,
		    "float w = 100.0;" ,
		    "float t = -.5;" ,
		    "for (float f = 1.0 ; f <= 10.0 ; f++ )" ,
		    "{" ,
		        "float power = pow( 2.0, f );" ,
		        "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );" ,
		    "}", 
		    "return t;" ,
		"}" ,

		"void main()" ,
		"{" ,
    		"vUv = uv;" ,
		    // get a turbulent 3d noise using the normal, normal to high freq
		    "noise = 10.0 *  -.10 * turbulence( .5 * normal );",
		    // get a 3d noise using the position, low frequency
		    "float b = 5.0 * pnoise( 0.05 * position, vec3( 100.0 ) );",
		    // compose both noises
		    "float displacement = - 10. * noise + b;" ,
		    
		    // move the position along the normal and transform it
		    "vec3 newPosition = position + normal * displacement;" ,
		    "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );" ,

		"}" 
	].join("\n"),

	fragmentShader: [
		//"precision mediump float;" ,
		//"varying vec2 positionx;" ,
		//"varying vec2 vUv;" ,
		//"void main() {",
		//	"gl_FragColor = vec4( vec3( vUv, 0. ), 1. );" ,
			//"gl_FragColor = vec4( vUv.x , 0.0 , 0.0 , 1.0 );" ,
		//"}"
		"varying vec2 vUv;",
		"varying float noise;",

		"void main()",
		"{" ,

		    // compose the colour using the UV coordinate
		    // and modulate it with the noise like ambient occlusion
		    "vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );" ,
		    "gl_FragColor = vec4( color.rgb, 1.0 );" ,

		"}"
		


	].join("\n")

};











//**gradient shader
G.gradientShader = 
{

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },
		"angle":    { type: "f", value: 0.0 }

	},

	vertexShader: [
		//"precision mediump float;" ,
		//"varying vec2 vUv;",
		//"varying vec2 position;" ,
		//"precision mediump float;" ,
		//"varying vec2 positionx;" ,
		"varying vec2 vUv;" ,
		"void main() {",
			//"positionx = position;" ,
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [
		//"precision mediump float;" ,
		//"varying vec2 positionx;" ,
		"varying vec2 vUv;" ,
		"void main() {",
			//"gl_FragColor = vec4( vec3( vUv, 0. ), 1. );" ,
			"gl_FragColor = vec4( 1.0-vUv.x , 0.0 , 0.0 , 1.0 );" ,
		"}"

	].join("\n")

};
