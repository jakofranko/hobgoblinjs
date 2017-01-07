Game.Geometry = {
    getLine: function(startX, startY, endX, endY) {
        var points = [];
        var dx = Math.abs(endX - startX);
        var dy = Math.abs(endY - startY);
        var sx = (startX < endX) ? 1 : -1;
        var sy = (startY < endY) ? 1 : -1;
        var err = dx - dy;
        var e2;

        while (true) {
            points.push({x: startX, y: startY});
            if (startX == endX && startY == endY) {
                break;
            }
            e2 = err * 2;
            if (e2 > -dx) {
                err -= dy;
                startX += sx;
            }
            if (e2 < dx){
                err += dx;
                startY += sy;
            }
        }

        return points;
    },
    getCircle: function(centerX, centerY, radius) {
        var angle = 0,
            increment = 10 / radius, // should have an inverse relationship to radius
            points = [],
            repeatTries = 0,
            x, y;

        while(angle <= 360) {
            x = Math.round(centerX + radius * Math.cos(angle));
            y = Math.round(centerY + radius * Math.sin(angle));

            var key = x + "," + y;
            if(points.indexOf(key) < 0)
                points.push(key);
            else
                repeatTries++;

            angle += increment;
        }
        return points;
    },
    getDistance: function(startX, startY, endX, endY) {
        // Math.pow(a, 2) + Math.pow(b, 2) = Math.pow(c, 2)
        // c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
        var horizontalDistance = startX - endX;
        var verticalDistance = startY - endY;
        return Math.sqrt(Math.pow(horizontalDistance, 2) + Math.pow(verticalDistance, 2));
    }
};