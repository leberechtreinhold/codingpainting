function write_text(canvas_ctx, text, pos_x, pos_y, rotation = null, color = "white", font = "18px Verdana") {
    if (rotation != null) {
        canvas_ctx.save();
        canvas_ctx.rotate(rotation);
    }
    canvas_ctx.textAlign = "center";
    canvas_ctx.fillStyle = color;
    canvas_ctx.font = font;
    canvas_ctx.fillText(text, pos_x, pos_y);

    if (rotation != null) {
        canvas_ctx.restore();
    }
}

function write_line(canvas_ctx, from_x, from_y, to_x, to_y, color = "white", width = 1, dashes = []) {
    canvas_ctx.beginPath();
    canvas_ctx.moveTo(from_x, from_y);
    canvas_ctx.lineTo(to_x, to_y);
    canvas_ctx.strokeStyle = color;
    canvas_ctx.lineWidth = width;
    canvas_ctx.setLineDash(dashes);
    canvas_ctx.stroke();
}

function update_frame_canvas(params, calcs) {
    // Getting the canvas and elements
    var frame_canvas = document.getElementById("canvas_frame");
    var frame_ctx = frame_canvas.getContext("2d");

    // Frame image
    var margin_size = 40;
    var vert_size_frame = Math.ceil(params["sensor_vertical_size"] * 20);
    var horz_size_frame = Math.ceil(params["sensor_horizontal_size"] * 20);
    frame_canvas.height = vert_size_frame + margin_size;
    frame_canvas.width = horz_size_frame + margin_size;

    frame_ctx.globalAlpha = 1.0;

    // Background
    frame_ctx.fillStyle = "rgba(0,0,0,1)";
    frame_ctx.fillRect(0, 0, frame_canvas.width, frame_canvas.height);

    // The image itself
    var frame_img = new Image;
    frame_img.src = "/img/lewis_chessman_front_national_museum_scotland_nms19_ccsa3.png";
    frame_img.onload = function () {
        var projected_img_vert = calcs["vert_fill"] * vert_size_frame;
        var projected_img_horz = calcs["horz_fill"] * horz_size_frame;
        var img_pos_x_topleft = frame_canvas.width / 2 - projected_img_horz / 2;
        var img_pos_y_topleft = frame_canvas.height / 2 - projected_img_vert / 2;
        frame_ctx.drawImage(frame_img, img_pos_x_topleft, img_pos_y_topleft, projected_img_horz, projected_img_vert);

        // Border of the frame where the image is
        frame_ctx.strokeStyle = "rgba(255,255,255,1)";
        frame_ctx.lineWidth = 1;
        frame_ctx.strokeRect(Math.ceil(margin_size / 2) - 0.5, Math.ceil(margin_size / 2) - 0.5, horz_size_frame, vert_size_frame);

        // Percent of filled on each side
        write_line(frame_ctx, img_pos_x_topleft - margin_size + 5, img_pos_y_topleft, img_pos_x_topleft - margin_size + 5, img_pos_y_topleft + projected_img_vert);
        write_text(frame_ctx, calcs["percent_vert_filled"].toFixed(2) + "%",
            -Math.floor(frame_canvas.height / 2), img_pos_x_topleft - margin_size, -Math.PI / 2);

        write_line(frame_ctx, img_pos_x_topleft, img_pos_y_topleft - margin_size + 5, img_pos_x_topleft + projected_img_horz, img_pos_y_topleft - margin_size + 5);
        write_text(frame_ctx, calcs["percent_horz_filled"].toFixed(2) + "%", Math.floor(frame_canvas.width / 2), img_pos_y_topleft - margin_size);

        // Sensor sizes on each side
        write_text(frame_ctx, params["sensor_horizontal_size"] + "mm", Math.floor(frame_canvas.width / 2), Math.ceil(margin_size / 2) - 5);
        write_text(frame_ctx, params["sensor_vertical_size"] + "mm", -Math.floor(frame_canvas.height / 2), Math.ceil(margin_size / 2) - 5, -Math.PI / 2);

        // Macro ratio on the bottom
        min_macro_ratio = Math.min(calcs["macro_vert_ratio"], calcs["macro_horz_ratio"]);
        write_text(frame_ctx, "Macro required 1:" + min_macro_ratio.toFixed(1),
            Math.floor(frame_canvas.width / 2), frame_canvas.height - Math.ceil(margin_size / 2) + 16);
    }
}

function update_dof_canvas(params, calcs) {
    // Getting the canvas and elements
    var dof_canvas = document.getElementById("canvas_dof");
    var dof_ctx = dof_canvas.getContext("2d");

    // Frame image
    var margin_size = 40;
    var vert_size = Math.ceil(params["sensor_vertical_size"] * 20);
    var horz_size_frame = vert_size * 3;
    dof_canvas.height = vert_size + margin_size;
    dof_canvas.width = horz_size_frame + margin_size;

    dof_ctx.globalAlpha = 1.0;

    // Background
    dof_ctx.fillStyle = "rgba(0,0,0,1)";
    dof_ctx.fillRect(0, 0, dof_canvas.width, dof_canvas.height);

    // we use two images: the camera and the side element
    var dof_img = new Image;
    dof_img.src = "/img/lewis_chessman_side_national_museum_scotland_nms19_ccsa3.png";

    dof_img.onload = function () {
        var cam_img = new Image;
        cam_img.src = "/img/camera-tripod-silhouette-clipart_goodfreephotos_cc0.png";
        cam_img.onload = function () {
            // Draw the camera on the left
            cam_ratio = cam_img.height / cam_img.width;
            camera_height = dof_canvas.height;
            camera_width = camera_height / cam_ratio;
            dof_ctx.drawImage(cam_img, 0, 0, camera_width, camera_height);

            // Draw the object on the right, with relative size to the frame
            var projected_img_vert = calcs["vert_fill"] * vert_size;
            var img_ratio = params["object_height"] / params["object_depth"];
            var img_height = projected_img_vert;
            var img_width = img_height / img_ratio;
            dof_ctx.drawImage(dof_img,
                dof_canvas.width - img_width - margin_size / 2,
                dof_canvas.height / 2 - img_height / 2,
                img_width, img_height);

            // Border of the vertical part of the frame
            dof_ctx.strokeStyle = "rgba(255,255,255,1)";
            dof_ctx.lineWidth = 1;
            dof_ctx.strokeRect(-2, Math.ceil(margin_size / 2) - 0.5, dof_canvas.width + 4, vert_size);

            center_img_x = dof_canvas.width - margin_size / 2 - img_width / 2;
            center_img_y = dof_canvas.height / 2;
            top_img_frame = Math.ceil(margin_size / 2);
            bottom_img_frame = dof_canvas.height - Math.ceil(margin_size / 2);

            // Lines to the camera
            var center_camera_x = camera_width / 2;
            var center_camera_y = camera_height / 2;
            write_line(dof_ctx, center_camera_x, center_camera_y, center_img_x, top_img_frame, "red", 0.5);
            write_line(dof_ctx, center_camera_x, center_camera_y, center_img_x, bottom_img_frame, "red", 0.5);

            // DOF lines
            var img_width_focus = img_width * calcs["percent_dof"] / 100;
            var far_focus = center_img_x + img_width_focus / 2;
            var near_focus = center_img_x - img_width_focus / 2;

            write_line(dof_ctx, near_focus, top_img_frame, near_focus, bottom_img_frame, "green", 1);
            write_line(dof_ctx, far_focus, top_img_frame, far_focus, bottom_img_frame, "green", 1);

            // Distance line
            write_line(dof_ctx, center_camera_x, center_camera_y - 0.5, center_img_x, center_camera_y - 0.5, "cyan", 1, [20, 10]);

            // Distance Text
            write_text(dof_ctx, params["distance_to_subject"] + "mm", Math.floor(dof_canvas.width / 2), Math.floor(dof_canvas.height / 2) - 5);

            // DOF Text
            write_text(dof_ctx, calcs["total_dof"].toFixed(1) + "mm", center_img_x, top_img_frame - 5);
            write_text(dof_ctx, calcs["percent_dof"].toFixed(2) + "%", center_img_x, bottom_img_frame + 18);
        }
    }
}

function update_canvas(params, calcs) {
    update_frame_canvas(params, calcs);
    update_dof_canvas(params, calcs);
}

function get_parameters() {
    var result = {}
    result["object_height"] = document.getElementById("object_height").value;
    result["object_width"] = document.getElementById("object_width").value;
    result["object_depth"] = document.getElementById("object_depth").value;
    result["focal_length"] = document.getElementById("focal_length").value;
    result["sensor_vertical_size"] = document.getElementById("sensor_vertical_size").value;
    result["sensor_horizontal_size"] = document.getElementById("sensor_horizontal_size").value;
    result["aperture"] = document.getElementById("aperture").value;
    result["circle_of_confusion"] = document.getElementById("circle_of_confusion").value;
    result["distance_to_subject"] = document.getElementById("distance_to_subject").value;
    return result;
}

function calc() {
    var params = get_parameters();

    var calcs = {};

    calcs["vert_fill"] = (params["object_height"]
        * (1 / (1 / params["focal_length"] - 1 / params["distance_to_subject"]) / params["distance_to_subject"])
        / params["sensor_vertical_size"]);
    calcs["percent_vert_filled"] = calcs["vert_fill"] * 100;
    calcs["macro_vert_ratio"] = 1 / ((params["sensor_vertical_size"] * calcs["vert_fill"]) / params["object_height"]);

    calcs["horz_fill"] = (params["object_width"]
        * (1 / (1 / params["focal_length"] - 1 / params["distance_to_subject"]) / params["distance_to_subject"])
        / params["sensor_horizontal_size"]);
    calcs["percent_horz_filled"] = calcs["horz_fill"] * 100;
    calcs["macro_horz_ratio"] = 1 / ((params["sensor_horizontal_size"] * calcs["horz_fill"]) / params["object_width"]);

    calcs["hyperfocal"] = (params["focal_length"] * params["focal_length"]) / (params["aperture"] * params["circle_of_confusion"]);
    calcs["near_point"] = (calcs["hyperfocal"] * params["distance_to_subject"])
        / (calcs["hyperfocal"] + (params["distance_to_subject"] - params["focal_length"]));
    calcs["far_point"] = (calcs["hyperfocal"] * params["distance_to_subject"])
        / (calcs["hyperfocal"] - (params["distance_to_subject"] - params["focal_length"]));
    calcs["total_dof"] = calcs["far_point"] - calcs["near_point"];
    calcs["percent_dof"] = calcs["total_dof"] / params["object_depth"] * 100;

    document.getElementById("result").innerText = "Vertically, you fill " + calcs["percent_vert_filled"].toFixed(2)
        + "% of the frame, with macro ratio 1:" + calcs["macro_vert_ratio"].toFixed(1) + ". "
        + "Horizontally, you fill " + calcs["percent_horz_filled"].toFixed(2)
        + "% of the frame, with macro ratio 1:" + calcs["macro_horz_ratio"].toFixed(1) + ". "
        + "You have a total of " + calcs["total_dof"].toFixed(2) + "mm of depth of field, with " + calcs["percent_dof"].toFixed(2) + "% of the object in focus.";

    update_canvas(params, calcs);
}

window.onload = function () { this.calc(); }