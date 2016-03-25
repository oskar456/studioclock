function LEDclock(context) {
    var T = true, F = false;
    var ctx = context;
    var font = [
         //0
        [F, T, T, T, F,
         T, F, F, F, T,
         T, F, F, F, T,
         T, F, F, F, T,
         T, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F],
         //1
        [F, F, T, F, F,
         F, T, T, F, F,
         F, F, T, F, F,
         F, F, T, F, F,
         F, F, T, F, F,
         F, F, T, F, F,
         F, T, T, T, F],
         //2
        [F, T, T, T, F,
         T, F, F, F, T,
         F, F, F, F, T,
         F, T, T, T, F,
         T, F, F, F, F,
         T, F, F, F, F,
         T, T, T, T, T],
         //3
        [F, T, T, T, F,
         T, F, F, F, T,
         F, F, F, F, T,
         F, F, T, T, F,
         F, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F],
         //4
        [F, F, F, T, F,
         F, F, T, T, F,
         F, T, F, T, F,
         T, F, F, T, F,
         T, T, T, T, T,
         F, F, F, T, F,
         F, F, F, T, F],
         //5
        [T, T, T, T, T,
         T, F, F, F, F,
         T, F, F, F, F,
         T, T, T, T, F,
         F, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F],
         //6
        [F, F, T, T, F,
         F, T, F, F, F,
         T, F, F, F, F,
         T, T, T, T, F,
         T, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F],
         //7
        [T, T, T, T, T,
         F, F, F, F, T,
         F, F, F, T, F,
         F, F, T, F, F,
         F, T, F, F, F,
         F, T, F, F, F,
         F, T, F, F, F],
         //8
        [F, T, T, T, F,
         T, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F,
         T, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F],
         //9
        [F, T, T, T, F,
         T, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, T,
         F, F, F, F, T,
         T, F, F, F, T,
         F, T, T, T, F]];
    var that = this;
    this.radius = 22;
    this.grid = 60;
    this.led_on = 'rgb(200,0,0)';
    this.led_off = 'rgb(40,0,0)';
    this.background = 'rgb(0,0,0)';
    this.time = new Date();

    function draw_matrix(digit) {
        //Draws a 7x5 dot matrix digit. Origin is the central dot.
        var i, x, y;
        for (i in font[digit]){
            x = (i%5 - 2) * that.grid;
            y = ((0^(i/5)) - 3) * that.grid;
            ctx.beginPath();
            ctx.fillStyle = (font[digit][i]? that.led_on: that.led_off);
            ctx.arc(x, y, that.radius, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    function draw_clock_digits() {
        //Draw dot-matrix digits.
        //draw big digits
        ctx.save();
        ctx.translate(-10*that.grid, 0);
        draw_matrix(0^(that.time.getHours()/10));
        ctx.translate(6*that.grid, 0);
        draw_matrix(that.time.getHours()%10);
        ctx.translate(8*that.grid, 0);
        draw_matrix(0^(that.time.getMinutes()/10));
        ctx.translate(6*that.grid, 0);
        draw_matrix(that.time.getMinutes()%10);
        ctx.restore();

        //draw small digits
        ctx.save();
        ctx.translate(0, 8*that.grid);
        ctx.scale(0.7, 0.7);
        ctx.translate(-3*that.grid, 0);
        draw_matrix(0^(that.time.getSeconds()/10));
        ctx.translate(6*that.grid, 0);
        draw_matrix(that.time.getSeconds()%10);
        ctx.restore();

        //draw central colon
        ctx.fillStyle = (that.led_on);
        ctx.beginPath();
        ctx.arc(0, -1*that.grid, that.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, that.grid, that.radius, 0, 2*Math.PI);
        ctx.fill();
    }

    function draw_radial_leds(distance, angle, data) {
        /**
         *  Draws radial led scale.
         *  @param distance Scale radius
         *  @param angle Angle between LEDs -- in radians
         *  @param data An itreable of bool data representing LED status
         */
        var i;
        ctx.save();
        for (i in data) {
            ctx.beginPath();
            ctx.fillStyle = (data[i]? that.led_on: that.led_off);
            ctx.arc(0, -distance, that.radius, 0, 2*Math.PI);
            ctx.fill();
            ctx.rotate(angle);
        }
        ctx.restore();
    }


    function draw_led_scale() {
        // Draws circular scale with LEDs.
        var points = [T, T, T, T, T, T, T, T, T, T, T, T];
        draw_radial_leds(13.8*that.grid, Math.PI/6, points);

        var ledcircle = [];
        for (var i=0; i<60; i++) {
            ledcircle[i] = ((i <= that.time.getSeconds())? T: F);
        }
        draw_radial_leds(15*that.grid, Math.PI/30, ledcircle);
    }

    this.draw = function () {
        var width = ctx.canvas.width;
        var height = ctx.canvas.height;
        var diameter = Math.min(width, height);
        ctx.beginPath();
        ctx.fillStyle = that.background;
        ctx.rect(0, 0, width, height);
        ctx.fill();

        ctx.save();
        //set up resolution independent canvas with
        //origin in the middle and radius of 1000 points
        ctx.translate(width/2.0, height/2.0);
        ctx.scale(diameter/2000.0, diameter/2000.0);
        draw_led_scale();
        draw_clock_digits();
        ctx.restore();
    };

}
