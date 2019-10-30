const LIGHT_HEIGHT = 20;
const NB_ENEMIES = 7;
const NB_TILES = 10;

function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] === item[0] && array[i][1] === item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function init()
{
    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    $container = $('#container');
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                                    ASPECT,
                                    NEAR,
                                    FAR);
    scene = new THREE.Scene();
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.z = 500;
    scene.add(camera);

    renderer.setSize(WIDTH, HEIGHT);

    $container.append(renderer.domElement);

    noGround = [];
    entitiesList = [];
    enemiesList = [];
    ground = new Ground(0xffffff, WIDTH, HEIGHT, NB_TILES);
    
    player1 = new Player("player1", 0xffff00, new THREE.Vector2(0, 0), 0);
    scene.add(player1.graphic);
    entitiesList.push([0, 0]);

    const sizeOfTileX = WIDTH / NB_TILES;
    const sizeOfTileY = HEIGHT / NB_TILES;

    for (var i = 0; i < NB_ENEMIES; i++) {
        do {
            var random_x = Math.floor(Math.random() * NB_TILES) - NB_TILES / 2;
            var random_y = Math.floor(Math.random() * NB_TILES) - NB_TILES / 2;

            var x = random_x * sizeOfTileX;
            var y = random_y * sizeOfTileY;
        } while (isItemInArray(noGround, [x, y]) || isItemInArray(entitiesList, [x, y]));

        let enemy = new Player("player" + (2 + i).toString(), 0xffff00, new THREE.Vector2(x, y), 0);
        enemiesList.push(enemy);
        entitiesList.push([x, y]);
        scene.add(enemy.graphic);
    }

    let position = "0,0," + LIGHT_HEIGHT.toString();
    light1 = new Light("sun", 0xffffff, position);
    scene.add(light1);
}

function Ground(color, size_x, size_y, nb_tile)
{
    colors = Array(0xff0000, 0x00ff00, 0x0000ff, 0x000000);

    sizeOfTileX = size_x / nb_tile;
    minX = -(size_x/2);
    maxX = (size_x/2);
    
    sizeOfTileY = size_y / nb_tile;
    minY = -(size_y/2);
    maxY = (size_y/2);

    for (x = minX; x <= maxX; x = x+sizeOfTileX){
        for (y = minY; y <= maxY; y = y+sizeOfTileY){
            if (x === 0 && y === 0) {
                color = colors[Math.floor(Math.random() * (colors.length - 1))];
            } else {
                color = colors[Math.floor(Math.random()*colors.length)];
            }
       
            if (0x000000 !== color)
            {
                tmpGround = new THREE.Mesh(
                new THREE.PlaneGeometry(sizeOfTileX-10, sizeOfTileY-10),
                new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: 0.6}));
                tmpGround.position.x = x;
                tmpGround.position.y = y;
                scene.add(tmpGround);
            }
            else
                noGround.push([x, y]);
        }
    }
}

function Light(name, color, position)
{
    pointLight = new THREE.PointLight(color, 50, 350);

    pointLight.position.x = position.split(',')[0];
    pointLight.position.y = position.split(',')[1];
    pointLight.position.z = position.split(',')[2];

    return pointLight;
}
