var renderer ,
    camera ,
    scene ,
    uniforms ,
    materialxx,
    frame = 0; 
var start = Date.now();
var scale = 0;
var onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, onMouseDownLon = 0,
lat = 0, onMouseDownLat = 0,
phi = 0, theta = 0;
lat = 15, isUserInteracting = false;

var contWidth = 500 ;
var contHeight = 400 ;

var keys = {};

$(document).keydown(function (e) 
{
    console.log(e.which )
    if( e.which == '38' || e.which == '39' || e.which == '37' || e.which == '40')
    e.preventDefault() ; 
    keys[e.which] = true;
});
$(document).keyup(function (e) {
    delete keys[e.which];
});

window.onload = function()
{
    init() ; 
}
function init()
{
    createTestScene5() ;
    setInterval( run , 1 ) ;
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}
function onMouseMove( event ) {
    uniforms.u_mouse.value.x = event.screenX / window.innerWidth ;
    uniforms.u_mouse.value.y = event.screenY / window.innerHeight;
}



var iterAngle = 0 ;
function run()
{
    //var delta=clock.getDelta();
    //tuniform.iGlobalTime.value += delta;

    var delta=clock.getDelta();
    uniforms.u_time.value = uniforms.u_time.value + delta ;

    renderer.render( scene , camera ) ; 
    /*
    var sinAngle = Math.sin( iterAngle ) * 50 ;
    iterAngle = iterAngle + 0.01 ; 
    //uniforms[ "scale" ].value = sinAngle ; //uniforms[ "scale" ].value + 0.1;
    //uniforms[ "scale" ].value = uniforms[ "scale" ].value - 0.1;
    uniforms.resolution.value  = new THREE.Vector2( 10 + iterAngle , 10 ) ; 
    */

    /*
    var keyP ; 
    for (var key in keys) 
        {
            keyP = key ; 
            if(typeof(first) !== 'function') 
            {
                break;
            }
        }
    if( keyP =='37') //keys["37"])
        {
            console.log('--<<')
            //hero.myp = new PIXI.Point( hero.myp.x  , hero.myp.y- speed ) ; 
            tuniform.leftPos.value = tuniform.leftPos.value - 0.005 ; 
        }
    if( keyP =='39')//keys["39"])
        {
            //hero.myp = new PIXI.Point( hero.myp.x  , hero.myp.y + speed) ; 
            tuniform.leftPos.value = tuniform.leftPos.value + 0.005 ;
        }
    if( keyP =='38')//keys["38"])
        {
            tuniform.upPos.value = tuniform.upPos.value + 0.005 ;
        }
        //DOWN
    if( keyP =='40')//keys["40"])
        {
            tuniform.upPos.value = tuniform.upPos.value - 0.005 ;
        }

    //A
    if( keyP =='65')//keys["40"])
        {
            tuniform.speed.value = tuniform.speed.value + 0.0005 ;
        }
    //Z
    if( keyP =='90')//keys["40"])
        {
            tuniform.speedRotation.value = tuniform.speedRotation.value + 0.0005 ;
        }

    //tobject.rotation.y = tobject.rotation.y + 0.01 ;
    if( sphere.rotation.z < 10 )
    {
        //console.log(sphere.position.z)
        sphere.position.z ++ ;
    }

    cube.rotation.y = cube.rotation.y + 0.01 ;
    cube.rotation.x = cube.rotation.x + 0.01 ;
    */
}

    

//*test scene 1
function createTestScene5()
{
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    document.getElementById('container').appendChild(renderer.domElement);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 50000);
    camera.position.set(0,0,900);
    scene.add(camera);

     // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
      var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    });

    // Set the background color of the scene.
    //renderer.setClearColorHex(0x333F47, 1);
 
    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    //scene.add(light);

    /*
    uniforms = 
    {
        time: { type: "f", value: 10 },
        resolution: { type: "v2", value: new THREE.Vector2 },
        mouse: { type: "v2", value: new THREE.Vector2 }
        //texture: { type: "t", value: THREE.ImageUtils.loadTexture('./box.png') }
    };
    uniforms.resolution.value  = new THREE.Vector2( 10 , 10 ) ; 
    material = new THREE.ShaderMaterial(
    {
      uniforms: uniforms,
      //attributes: attributes,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent
    });
    var geometry = new THREE.SphereGeometry(100, 80, 80);
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( 0 , 0 , 0)
    scene.add( sphere );

    */





    // tuniform = 
    // {
    //     iGlobalTime:    { type: 'f', value: 0.1 },
    //     iChannel0:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/2-square.jpg') },
    //     iChannel1:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/2-square.jpg' ) },
    //     leftPos : { type : 'f' , value : 0.5 } ,
    //     upPos : { type : 'f' , value : 0.5 } , 
    //     speed : { type : 'f' , value : 0.2 } , 
    //     speedRotation : { type : 'f' , value : 0.1 } 
    // };
    // tuniform.iChannel0.value.wrapS = tuniform.iChannel0.value.wrapT = THREE.RepeatWrapping;
    // tuniform.iChannel1.value.wrapS = tuniform.iChannel1.value.wrapT = THREE.RepeatWrapping;
    
    uniforms = 
    {
        u_mouse: { type: "v2", value: new THREE.Vector2( 0.1 , 0.1 ) } ,
        u_resolution: { type: "v2", value: new THREE.Vector2() } ,
        iChannel0:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/2-square.jpg') },
        iChannel1:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/2-square.jpg') },
        iChannel2:  { type: 't', value: THREE.ImageUtils.loadTexture( 'textures/1-square.jpg') },
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() } ,
        LightPosition : { type : "v3" , value : new THREE.Vector3( 1.0 , 2.0 , 1.0) } ,

        BrickColor : { type : "v3" , value : new THREE.Vector3( 0.3 , 1.0 , 0.5 ) } ,
        MortarColor : { type : "v3" , value : new THREE.Vector3( 1.0 , .0 , 0.4) } , 
        BrickSize : { type : "v3" , value : new THREE.Vector3( 1.0 , 1.0 , 1.0 ) } ,
        BrickPct : { type : "v3" , value : new THREE.Vector2( ) }
    };
    uniforms.LightPosition.x = 1.0 ;
    uniforms.LightPosition.y = 1.0 ;
    uniforms.LightPosition.z = 1.0 ;

    // uniforms.BrickColor.x = 1.0 ;
    // uniforms.BrickColor.y = 0.5 ;
    // uniforms.BrickColor.z = .7 ;

    // uniforms.MortarColor.x = .5 ;
    // uniforms.MortarColor.y = 1.0 ;
    // uniforms.MortarColor.z = .3 ;

    // uniforms.BrickSize.x = .25 ;
    // uniforms.BrickSize.y = .25 ;
    // uniforms.BrickSize.z = .25 ;

    // uniforms.BrickPct.x = 1.0 ;
    // uniforms.BrickPct.y = .4 ;
    // uniforms.BrickPct.z = .4 ;
    //tuniform.iChannel0.value.wrapS = tuniform.iChannel0.value.wrapT = THREE.RepeatWrapping;
    //tuniform.iChannel1.value.wrapS = tuniform.iChannel1.value.wrapT = THREE.RepeatWrapping;
    var mat = new THREE.ShaderMaterial( {

            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShaderImpulse').textContent,
            fragmentShader: document.getElementById('fragmentShaderImpulse').textContent ,
            side:THREE.DoubleSide , 
            shading : THREE.smoothShading

        } );

    tobject = new THREE.Mesh( new THREE.PlaneGeometry( 700 , 700 , 10 , 10 ), mat);
    //tobject.rotation.y = 45 ;
    //tobject.rotation.z = 15 ;
    tobject.rotation.x = 15 ;
    scene.add( tobject ) ;  

    var geometry = new THREE.SphereGeometry(10, 80, 80);
    sphere = new THREE.Mesh( geometry, mat );
    //scene.add( sphere );

    clock = new THREE.Clock();

    var light = new THREE.PointLight(0xffffff);
    light.position.set(100,100,100);
    //scene.add(light);
    // uniforms2 = 
    // {
    //     //time: { type: "f", value: 10 },
    //     //resolution: { type: "v2", value: new THREE.Vector2 },
    //     //mouse: { type: "v2", value: new THREE.Vector2 }
    //     //texture: { type: "t", value: THREE.ImageUtils.loadTexture('./box.png') }
    // };
    // //uniforms.resolution.value  = new THREE.Vector2( 10 , 10 ) ; 
    // material2 = new THREE.ShaderMaterial(
    // {
    //   uniforms: uniforms,
    //   //attributes: attributes,
    //   vertexShader: document.getElementById('vertexRGBShader').textContent,
    //   fragmentShader: document.getElementById('fragmentRGBShader').textContent
    // });
    // var geometry = new THREE.SphereGeometry(100, 80, 80);
    // sphere2 = new THREE.Mesh( geometry, material );
    // sphere2.position.set( 0 , 30 , 0)
    // scene.add( sphere2 );

    var geometry = new THREE.BoxGeometry( 10, 10 , 10 , 40 , 40 , 40 );
    cube = new THREE.Mesh( geometry, mat );
    //scene.add( cube );
    cube.position.z = 880 ;
    cube.rotation.y = 30 ;
    cube.rotation.x = 20 ; 

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    //onWindowResize();
    window.addEventListener( 'mousemove', onMouseMove, false );

}

var CustomMat = function (texturePath, shader) {

    var texture = onepixLoadTexture(texturePath);

    uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms[ "texture1" ].value = texture;

    var parameters = {fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms};
    return new THREE.ShaderMaterial(parameters);
}
//used to load textures
function onepixLoadTexture(path) {

    // texture - texture must not be in same folder or there is an error.
    var texture = THREE.ImageUtils.loadTexture(path, {}, function () {
        // texture loaded
        $('#debug #textures').append("texture loaded: " + path + "<br>");
    },
            function () {
                //error, texture not loaded
                $('#debug #textures').append("unable to load: " + path + "<br>");
            });

    return texture;
}









if (typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}


