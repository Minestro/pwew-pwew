var bulletTime1 = 0;
var lifes = 3;
const BULLET_RADIUS = 2;
const BULLET_MOVE_DISTANCE = 5;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.8 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(BULLET_RADIUS),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets


    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += BULLET_MOVE_DISTANCE * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += BULLET_MOVE_DISTANCE * Math.sin(player1.bullets[i].angle);
    }

}

function collisions()
{
    bullet_collision();
    player_collision();
    player_falling();
}

function bullet_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

    for (var j = 0; j < player1.bullets.length; j++) {
        var bullet = player1.bullets[j];
        for (i = 0; i < enemiesList.length; i++) {
            var enemy = enemiesList[i];
            console.log(bullet.position.distanceTo(enemy.graphic.position));
            if (bullet.position.distanceTo(enemy.graphic.position) < (PLAYER_RADIUS + BULLET_RADIUS + BULLET_MOVE_DISTANCE)) {
                scene.remove(enemy.graphic);
                enemiesList.splice(enemiesList.indexOf(enemy), 1);
                break;
            }
        }
    }
}

function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if ( x > WIDTH )
        player1.graphic.position.x -= x - WIDTH;
    if ( x < 0 )
        player1.graphic.position.x -= x;
    if ( y < 0 )
        player1.graphic.position.y -= y;
    if ( y > HEIGHT )
        player1.graphic.position.y -= y - HEIGHT;

}

function player_falling()
{
    var sizeOfTileX = WIDTH / NB_TILES;
    var sizeOfTileY = HEIGHT / NB_TILES;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var minX = tileX - sizeOfTileX / 2;
        var maxX = tileX + sizeOfTileX / 2;
        var minY = tileY - sizeOfTileY / 2;
        var maxY = tileY + sizeOfTileY / 2;

        if (x > minX && x < maxX && y > minY && y < maxY)
        {
            player1.dead();
        }
    }

}
