const path = require("path");
const glob = require("glob");
const child_process = require("child_process");
const options = {
	glob: "/media/athroener/plex/**/*.ts",
	max: 1000,
}


const files = glob.sync(options.glob);
const max = options.max || files.length;
files
	.slice(0, max)
	.map(encode);

function encode(file) {
	const npath = path.parse(file);
	delete npath.base;
	npath.ext = ".mp4";
        const args = [
		"-y",
		"-hwaccel",
		"cuvid",
		"-c:v",
		"mpeg2_cuvid",
		"-i",
		file,
		"-c:v",
		"h264_nvenc",
		"-preset",
		"slow",
		path.format(npath),
	];
        const command = `ffmpeg ${args.join(" ")}`;
	console.log(command);
	// process.exit(1);
	const result = child_process.spawnSync("ffmpeg", args,
	{
		stdio: "inherit",
	}
	);
	console.log("Error", result.error);	
	console.log(result.output);
	if (result.status === 0) {
		console.log("Removing file");
		child_process.spawnSync("rm", [file]);
	}
}


